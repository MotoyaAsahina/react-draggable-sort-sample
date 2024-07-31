import { createContext, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import DraggableItem from '@/components/DraggableItem'
import DraggableList from '@/components/DraggableList'
import MultiHeightPanel from '@/components/MultiHeightPanel'
import Panel from '@/components/Panel'
import SimplePanel from '@/components/SimplePanel'
import NavigationButton from '@/components/UI/NavigationButton'

// prettier-ignore
const fruits = [
  '1 apple', '2 banana', '3 orange', '4 grape', '5 melon', '6 strawberry',
  '7 peach', '8 lemon', '9 kiwi', '10 mango', '11 pineapple', '12 watermelon',
  '13 cherry', '14 plum', '15 pear', '16 apricot', '17 peach', '18 lemon',
  '19 kiwi', '20 mango', '21 pineapple', '22 watermelon', '23 cherry', '24 plum',
  '25 pear', '26 apricot'
]

// prettier-ignore
const animals = [
  '1 dog', '2 cat', '3 rabbit', '4 hamster', '5 pig', '6 parrot',
  '7 goldfish', '8 turtle', '9 cow', '10 dolphin', '11 horse', '12 wolf',
  '13 fox', '14 kangaroo', '15 bear', '16 koala', '17 gorilla', '18 monkey',
  '19 deer', '20 zebra', '21 elephant', '22 tiger', '23 gnu', '24 goat',
  '25 lion', '26 camel'
]

export const DragContext = createContext<{
  chosenItem: React.MutableRefObject<HTMLElement | null>
  chosenItemParent: React.MutableRefObject<HTMLDivElement | null>
  isStayingChangedItem: React.MutableRefObject<boolean>
  latestChangedItem: React.MutableRefObject<HTMLElement | null>
  latestMovingDirection: React.MutableRefObject<'up' | 'down'>
}>({
  chosenItem: { current: null },
  chosenItemParent: { current: null },
  isStayingChangedItem: { current: false },
  latestChangedItem: { current: null },
  latestMovingDirection: { current: 'up' },
})

export default function App() {
  const chosenItem = useRef<HTMLElement | null>(null)
  const chosenItemParent = useRef<HTMLDivElement | null>(null)

  const isStayingChangedItem = useRef(false)
  const latestChangedItem = useRef<HTMLElement | null>(null)
  const latestMovingDirection = useRef<'up' | 'down'>('up')

  const path = useLocation().pathname

  if (path == '/simple' || path == '/react-draggable-sort-sample/simple') {
    return (
      <div className="bg-gradient-to-br from-blue-500 via-green-500 to-yellow-200 overflow-x-scroll relative">
        <div className="w-fit h-screen my-0 mx-auto p-8 flex place-items-center justify-center text-center gap-8">
          <SimplePanel items={fruits} />
        </div>
      </div>
    )
  }

  if (path == '/multi' || path == '/react-draggable-sort-sample/multi') {
    return (
      <div className="bg-gradient-to-br from-blue-500 via-green-500 to-yellow-200 overflow-x-scroll relative">
        <div className="w-fit h-screen my-0 mx-auto p-8 flex place-items-center justify-center text-center gap-8">
          <MultiHeightPanel items={fruits} />
        </div>
      </div>
    )
  }

  if (path == '/complete' || path == '/react-draggable-sort-sample/complete') {
    return (
      <div className="bg-gradient-to-br from-blue-500 via-green-500 to-yellow-200 overflow-x-scroll relative">
        <div className="w-fit h-screen my-0 mx-auto p-8 flex place-items-center justify-center text-center gap-8">
          <DragContext.Provider
            value={{
              chosenItem,
              chosenItemParent,
              isStayingChangedItem,
              latestChangedItem,
              latestMovingDirection,
            }}
          >
            <DraggableList className="w-88 h-full max-h-120 px-4 py-2 rounded-md bg-white shadow-xl overflow-y-scroll">
              {fruits.map((item, index) => (
                <DraggableItem
                  key={index}
                  className={
                    'my-2.5 p-2 rounded-md bg-blue-50 shadow-sm shadow-blueGray shadow-op-50 cursor-pointer' +
                    [' h-10', ' h-16', ' h-22'][index % 3]
                  }
                  onDrop={(newIndex) => {
                    console.log(newIndex)
                  }}
                >
                  <p className="text-gray-7">{item}</p>
                </DraggableItem>
              ))}
            </DraggableList>
            <DraggableList className="w-88 h-full max-h-120 px-4 py-2 rounded-md bg-white shadow-xl overflow-y-scroll">
              {animals
                .map((v) => v.toUpperCase())
                .map((item, index) => (
                  <DraggableItem
                    key={index}
                    className={
                      'my-2.5 p-2 rounded-md bg-blue-50 shadow-sm shadow-blueGray shadow-op-50 cursor-pointer' +
                      [' h-10', ' h-16', ' h-22'][index % 3]
                    }
                    onDrop={(newIndex) => {
                      console.log(newIndex)
                    }}
                  >
                    <p className="text-gray-7">{item}</p>
                  </DraggableItem>
                ))}
            </DraggableList>
          </DragContext.Provider>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 via-green-500 to-yellow-200 overflow-x-scroll relative">
      {/* Button */}
      <div className="m-6 absolute right-0 bottom-0 flex flex-col gap-3">
        <NavigationButton path="simple" name="Simple version" />
        <NavigationButton path="multi" name="Multi-height version" />
        <NavigationButton path="complete" name="Complete version" />
      </div>

      {/* Panels */}
      <div className="w-fit h-screen my-0 mx-auto p-8 flex place-items-center justify-center text-center gap-8">
        <DragContext.Provider
          value={{
            chosenItem,
            chosenItemParent,
            isStayingChangedItem,
            latestChangedItem,
            latestMovingDirection,
          }}
        >
          <Panel items={fruits} />
          <Panel items={animals.map((v) => v.toUpperCase())} />
        </DragContext.Provider>
      </div>
    </div>
  )
}
