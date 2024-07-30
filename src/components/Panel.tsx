import { useContext, useRef } from 'react'

import { DragContext } from '@/App'

type PanelProps = {
  items: string[]
}

const getItemsSlice = (list: HTMLDivElement, start: number, end?: number) =>
  Array.from(list.children).slice(start, end ?? list.childElementCount)

const animate = (item: HTMLElement, direction: 'up' | 'down') => {
  item.animate(
    [
      { transform: `translateY(${direction === 'up' ? '100%' : '-100%'})` },
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

  if (prevIndex < newIndex) {
    target.after(item)

    getItemsSlice(list, prevIndex, newIndex).forEach((item) => {
      animate(item as HTMLElement, 'up')
    })
    animate(item as HTMLElement, 'down')
  } else {
    target.before(item)

    getItemsSlice(list, newIndex + 1, prevIndex + 1).forEach((item) => {
      animate(item as HTMLElement, 'down')
    })
    animate(item as HTMLElement, 'up')
  }
}

export default function Panel(props: PanelProps) {
  const draggableList = useRef<HTMLDivElement>(null)

  const { chosenItem, chosenItemParent } = useContext(DragContext)

  const getItemIndex = (item: HTMLElement) => {
    // const thisPanelItems = Array.from(draggableList.current!.children)
    // return thisPanelItems.includes(item)
    //   ? thisPanelItems.indexOf(item)
    //   : Array.from(chosenItemParent.current!.children).indexOf(item)
    return (
      (Array.from(draggableList.current!.children).indexOf(item) + 1 ||
        Array.from(chosenItemParent.current!.children).indexOf(item) + 1) - 1
    )
  }

  const dragStart = (e: React.DragEvent<HTMLDivElement>) => {
    chosenItem.current = e.currentTarget
    chosenItemParent.current = draggableList.current
    console.log('dragStart', getItemIndex(e.currentTarget))
  }

  const dragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLElement

    if (target === chosenItem.current) return

    for (const anim of target!.getAnimations()) {
      if (anim.playState === 'running') return
    }

    if (chosenItemParent.current !== draggableList.current) {
      console.log('dragEnter', 'different parent')

      const prevIndex = getItemIndex(chosenItem.current!)
      target.before(chosenItem.current!)

      getItemsSlice(chosenItemParent.current!, prevIndex).forEach((item) => {
        animate(item as HTMLElement, 'up')
      })

      const newIndex = getItemIndex(chosenItem.current!)
      chosenItemParent.current = draggableList.current

      getItemsSlice(draggableList.current!, newIndex + 1).forEach((item) => {
        animate(item as HTMLElement, 'down')
      })

      return
    }

    const prevIndex = getItemIndex(chosenItem.current!)
    const newIndex = getItemIndex(target)

    moveItems(draggableList.current!, prevIndex, newIndex)

    console.log('dragEnter', prevIndex, newIndex)
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
          className="my-2.5 p-2 rounded-md bg-blue-50 shadow-sm shadow-blueGray shadow-op-50 cursor-pointer"
          key={index}
          draggable
          onDragStart={(e) => dragStart(e)}
          onDragEnter={(e) => dragEnter(e)}
        >
          <p className="text-gray-7">{item}</p>
        </div>
      ))}
    </div>
  )
}
