import { useRef } from 'react'

type PanelProps = {
  items: string[]
}

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

export default function MultiHeightPanel(props: PanelProps) {
  const draggableList = useRef<HTMLDivElement>(null)

  const hoveringItem = useRef<HTMLElement | null>(null)
  const chosenItem = useRef<HTMLElement | null>(null)
  const chosenItemIndex = useRef<number | null>(null)

  const isStayingChangedItem = useRef(false)
  const latestChangedItem = useRef<HTMLElement | null>(null)
  const latestMovingDirection = useRef<'up' | 'down'>('up')

  const getItemIndex = (item: HTMLElement) =>
    Array.from(draggableList.current?.children ?? []).indexOf(item)

  const getItemsSlice = (list: HTMLDivElement, start: number, end?: number) =>
    Array.from(list.children).slice(start, end ?? list.childElementCount)

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    chosenItem.current = e.currentTarget
    chosenItemIndex.current = getItemIndex(e.currentTarget)
    console.log('dragStart', chosenItemIndex.current)
  }

  const dragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLElement
    hoveringItem.current = target

    if (chosenItem.current === target) return

    for (const anim of target?.getAnimations() ?? []) {
      if (anim.playState === 'running') return
    }

    if (isStayingChangedItem.current) return

    const prevIndex = chosenItemIndex.current!

    if (prevIndex < getItemIndex(target)) {
      target.after(chosenItem.current!)
      chosenItemIndex.current = getItemIndex(chosenItem.current!)

      console.log('dragEnter', prevIndex, chosenItemIndex.current)

      getItemsSlice(draggableList.current!, prevIndex, chosenItemIndex.current).forEach((item) => {
        animate(
          item as HTMLElement,
          'up',
          (chosenItem.current!.clientHeight / item.clientHeight) * 100,
        )
      })
      animate(
        chosenItem.current!,
        'down',
        (target.clientHeight / chosenItem.current!.clientHeight) * 100,
      )
      latestMovingDirection.current = 'down'
    } else {
      target.before(chosenItem.current!)
      chosenItemIndex.current = getItemIndex(chosenItem.current!)

      console.log('dragEnter', prevIndex, chosenItemIndex.current)

      getItemsSlice(draggableList.current!, chosenItemIndex.current + 1, prevIndex + 1).forEach(
        (item) => {
          animate(
            item as HTMLElement,
            'down',
            (chosenItem.current!.clientHeight / item.clientHeight) * 100,
          )
        },
      )
      animate(
        chosenItem.current!,
        'up',
        (target.clientHeight / chosenItem.current!.clientHeight) * 100,
      )
      latestMovingDirection.current = 'up'
    }

    latestChangedItem.current = target

    if (chosenItem.current!.clientHeight <= target.clientHeight) isStayingChangedItem.current = true
  }

  const onDrag = (e: React.DragEvent<HTMLDivElement>) => {
    for (const anim of latestChangedItem.current?.getAnimations() ?? []) {
      if (anim.playState === 'running') return
    }

    if (!isStayingChangedItem.current) return

    const mouseY = e.pageY
    const largeItemY = latestChangedItem.current!.getBoundingClientRect().top
    const largeItemBottom = latestChangedItem.current!.getBoundingClientRect().bottom
    const chosenItemHeight = chosenItem.current!.clientHeight

    if (latestMovingDirection.current === 'down' && mouseY < largeItemY + chosenItemHeight) {
      console.log('onDrag', 'return up')

      latestChangedItem.current!.before(chosenItem.current!)
      chosenItemIndex.current! -= 1

      animate(
        chosenItem.current!,
        'up',
        (latestChangedItem.current!.clientHeight / chosenItem.current!.clientHeight) * 100,
      )
      animate(
        latestChangedItem.current!,
        'down',
        (chosenItem.current!.clientHeight / latestChangedItem.current!.clientHeight) * 100,
      )

      isStayingChangedItem.current = false
    } else if (latestMovingDirection.current === 'up' && mouseY > largeItemY + chosenItemHeight) {
      console.log('onDrag', 'return down')

      latestChangedItem.current!.after(chosenItem.current!)
      chosenItemIndex.current! += 1

      animate(
        chosenItem.current!,
        'down',
        (latestChangedItem.current!.clientHeight / chosenItem.current!.clientHeight) * 100,
      )
      animate(
        latestChangedItem.current!,
        'up',
        (chosenItem.current!.clientHeight / latestChangedItem.current!.clientHeight) * 100,
      )

      isStayingChangedItem.current = false
    }

    if (mouseY < largeItemY || mouseY > largeItemBottom) {
      isStayingChangedItem.current = false

      if (
        hoveringItem.current === chosenItem.current ||
        hoveringItem.current === latestChangedItem.current
      ) {
        return
      }

      const prevIndex = chosenItemIndex.current!
      if (prevIndex < getItemIndex(hoveringItem.current!)) {
        hoveringItem.current!.after(chosenItem.current!)
        chosenItemIndex.current = getItemIndex(chosenItem.current!)

        getItemsSlice(draggableList.current!, prevIndex, chosenItemIndex.current).forEach(
          (item) => {
            animate(
              item as HTMLElement,
              'up',
              (chosenItem.current!.clientHeight / item.clientHeight) * 100,
            )
          },
        )
        animate(
          chosenItem.current!,
          'down',
          (hoveringItem.current!.clientHeight / chosenItem.current!.clientHeight) * 100,
        )
        latestMovingDirection.current = 'up'
      } else {
        hoveringItem.current!.before(chosenItem.current!)
        chosenItemIndex.current = getItemIndex(chosenItem.current!)

        getItemsSlice(draggableList.current!, chosenItemIndex.current + 1, prevIndex + 1).forEach(
          (item) => {
            animate(
              item as HTMLElement,
              'down',
              (chosenItem.current!.clientHeight / item.clientHeight) * 100,
            )
          },
        )
        animate(
          chosenItem.current!,
          'up',
          (hoveringItem.current!.clientHeight / chosenItem.current!.clientHeight) * 100,
        )
        latestMovingDirection.current = 'down'
      }
    }
  }

  return (
    <div
      className="w-88 h-full max-h-120 px-4 py-2 rounded-md bg-white shadow-xl overflow-y-scroll"
      ref={draggableList}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer!.dropEffect = 'move'
      }}
    >
      {props.items.map((item, index) => (
        <div
          className={
            'my-2.5 p-2 rounded-md bg-blue-50 shadow-sm shadow-blueGray shadow-op-50 cursor-pointer' +
            [' h-10', ' h-16', ' h-22'][index % 3]
          }
          key={index}
          draggable
          onDragStart={dragStart}
          onDragEnter={dragEnter}
          onDrag={onDrag}
        >
          <p className="text-gray-7">{item}</p>
        </div>
      ))}
    </div>
  )
}
