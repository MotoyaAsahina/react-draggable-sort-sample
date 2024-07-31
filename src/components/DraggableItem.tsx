type DraggableItemProps = {
  children: React.ReactElement
  className: string
  onDrop?: (newIndex: number) => void
}

export default function DraggableItem(props: DraggableItemProps) {
  return <div className={props.className}>{props.children}</div>
}
