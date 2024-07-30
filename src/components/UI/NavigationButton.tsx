import { useLocation, useNavigate } from 'react-router-dom'

export default function NavigationButton(props: { path: string; name: string }) {
  const path = useLocation().pathname
  const navigate = useNavigate()

  return (
    <div
      className="px-3 py-1.5 rounded-md shadow-xl cursor-pointer bg-white hover:bg-blue-50 transition-300"
      onClick={() =>
        navigate(
          path.startsWith('/react-draggable-sort-sample')
            ? `/react-draggable-sort-sample/${props.path}`
            : `/${props.path}`,
        )
      }
    >
      <div className="flex items-center text-base font-200">
        <p className="flex-1 text-center px-5">{props.name}</p>
        <p>→</p>
      </div>
    </div>
  )
}
