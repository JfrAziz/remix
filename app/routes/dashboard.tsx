import { MetaFunction } from "@remix-run/node"

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard" },
    {
      name: "description",
      content: "Dashboard",
    },
  ]
}

export default function Dashboard() {
  return (
    <div className="container m-auto flex h-full w-full">
      <div className="mt-8 flex w-full flex-col justify-center gap-8 p-8">
        <div className="flex justify-center gap-2">dashboard</div>
      </div>
    </div>
  )
}
