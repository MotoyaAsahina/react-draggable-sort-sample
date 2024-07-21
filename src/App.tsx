import Panel from './components/Panel'

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

export default function App() {
  return (
    <div className="bg-gradient-to-br from-blue-500 via-green-500 to-yellow-200">
      <div className="h-screen my-0 mx-auto p-8 flex place-items-center justify-center text-center gap-8">
        <Panel items={fruits} />
        <Panel items={animals.map((v) => v.toUpperCase())} />
      </div>
    </div>
  )
}
