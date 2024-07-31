type DraggableItemProps = {
  children: React.ReactElement
  className: string
  onDrop?: (parentId: number | null, newIndex: number) => void
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export default function DraggableItem(props: DraggableItemProps) {
  return (
    <div className={props.className} onClick={props.onClick}>
      {props.children}
    </div>
  )
}
