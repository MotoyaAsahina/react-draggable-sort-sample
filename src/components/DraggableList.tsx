import { useContext, useRef } from 'react'

import { DragContext } from '@/App'

type DraggableListProps = {
  className: string
  children: React.ReactElement[]
  listId?: number
  group: string
}

const getItemsSlice = (list: HTMLDivElement, start: number, end?: number) =>
  Array.from(list.children).slice(start, end ?? list.childElementCount)

const animate = (item: HTMLElement, direction: 'up' | 'down', sizePercent: number = 100) => {
  item.animate(
    [
      { transform: `translateY(${direction === 'up' ? `${sizePercent}%` : `-${sizePercent}%`})` },
      { transform: 'translate3d(0px, 0px, 0px)' },
    ],
    {
      duration: 150,
      easing: 'ease',
      fill: 'forwards',
    },
  )
}

const moveItems = (list: HTMLDivElement, prevIndex: number, newIndex: number) => {
  const item = list.children[prevIndex]
  const target = list.children[newIndex]

  const itemHeight = item.clientHeight

  if (prevIndex < newIndex) {
    target.after(item)

    getItemsSlice(list, prevIndex, newIndex).forEach((item) => {
      animate(item as HTMLElement, 'up', (itemHeight / item.clientHeight) * 100)
    })
    animate(item as HTMLElement, 'down', (target.clientHeight / itemHeight) * 100)
  } else {
    target.before(item)

    getItemsSlice(list, newIndex + 1, prevIndex + 1).forEach((item) => {
      animate(item as HTMLElement, 'down', (itemHeight / item.clientHeight) * 100)
    })
    animate(item as HTMLElement, 'up', (target.clientHeight / itemHeight) * 100)
  }
}

export default function DraggableList(props: DraggableListProps) {
  const draggableList = useRef<HTMLDivElement>(null)

  const {
    chosenItem,
    chosenItemParent,
    chosenItemParentId,
    chosenItemParentGroup,
    isStayingChangedItem,
    latestChangedItem,
    latestMovingDirection,
  } = useContext(DragContext)

  const getItemIndex = (item: HTMLElement) => {
    return (
      (Array.from(draggableList.current!.children).indexOf(item) + 1 ||
        Array.from(chosenItemParent.current!.children).indexOf(item) + 1) - 1
    )
  }

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    chosenItem.current = e.currentTarget
    chosenItemParent.current = draggableList.current
    chosenItemParentId.current = props.listId ?? null
    chosenItemParentGroup.current = props.group
    console.log('dragStart', getItemIndex(e.currentTarget))
  }

  const dragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLElement

    if (target === chosenItem.current) return
    if (isStayingChangedItem.current && target === latestChangedItem.current) return

    for (const anim of target?.getAnimations() ?? []) {
      if (anim.playState === 'running') return
    }

    if (chosenItemParent.current !== draggableList.current) {
      console.log('dragEnter', 'different parent')

      if (chosenItemParentGroup.current !== props.group) return

      chosenItemParentId.current = props.listId ?? null

      const prevIndex = getItemIndex(chosenItem.current!)
      target.before(chosenItem.current!)

      getItemsSlice(chosenItemParent.current!, prevIndex).forEach((item) => {
        animate(
          item as HTMLElement,
          'up',
          (chosenItem.current!.clientHeight / item.clientHeight) * 100,
        )
      })

      const newIndex = getItemIndex(chosenItem.current!)
      chosenItemParent.current = draggableList.current

      getItemsSlice(draggableList.current!, newIndex + 1).forEach((item) => {
        animate(
          item as HTMLElement,
          'down',
          (chosenItem.current!.clientHeight / item.clientHeight) * 100,
        )
      })

      latestMovingDirection.current = 'up'
      latestChangedItem.current = target
      if (chosenItem.current!.clientHeight <= target.clientHeight) {
        isStayingChangedItem.current = true
      }

      return
    }

    const prevIndex = getItemIndex(chosenItem.current!)
    const newIndex = getItemIndex(target)

    moveItems(draggableList.current!, prevIndex, newIndex)

    latestMovingDirection.current = prevIndex < newIndex ? 'down' : 'up'
    latestChangedItem.current = target

    if (chosenItem.current!.clientHeight <= target.clientHeight) isStayingChangedItem.current = true

    console.log('dragEnter', prevIndex, newIndex)
  }

  const onDrag = (e: React.DragEvent<HTMLDivElement>) => {
    for (const anim of latestChangedItem.current?.getAnimations() ?? []) {
      if (anim.playState === 'running') return
    }

    if (!isStayingChangedItem.current) return

    const mouseY = e.pageY
    const largeItemY = latestChangedItem.current!.getBoundingClientRect().top
    const largeItemBottom = latestChangedItem.current!.getBoundingClientRect().bottom
    const largeItemHeight = latestChangedItem.current!.clientHeight
    const chosenItemHeight = chosenItem.current!.clientHeight

    if (latestMovingDirection.current === 'down' && mouseY < largeItemY + chosenItemHeight) {
      const prevIndex = getItemIndex(chosenItem.current!)
      moveItems(chosenItemParent.current!, prevIndex, prevIndex - 1)

      isStayingChangedItem.current = false

      console.log('dragEnter', prevIndex, prevIndex - 1)
    } else if (
      latestMovingDirection.current === 'up' &&
      mouseY > largeItemY + (largeItemHeight - chosenItemHeight)
    ) {
      const prevIndex = getItemIndex(chosenItem.current!)
      moveItems(chosenItemParent.current!, prevIndex, prevIndex + 1)

      isStayingChangedItem.current = false

      console.log('dragEnter', prevIndex, prevIndex + 1)
    }

    if (mouseY < largeItemY || mouseY > largeItemBottom) {
      isStayingChangedItem.current = false
    }
  }

  return (
    <div
      className={props.className}
      ref={draggableList}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer!.dropEffect = 'move'
      }}
    >
      {props.children.map((child) => (
        <div
          key={child.key}
          {...child.props}
          draggable
          onDragStart={dragStart}
          onDragEnter={dragEnter}
          onDrag={onDrag}
          onDrop={() =>
            child.props.onDrop(chosenItemParentId.current, getItemIndex(chosenItem.current!))
          }
        />
      ))}
    </div>
  )
}
