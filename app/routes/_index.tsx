import { Button } from "~/components/ui/button"
import {
  json,
  redirect,
  type MetaFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node"

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App with Hono backend and vite" },
    {
      name: "description",
      content: "Welcome to New Remix App with Hono backend and vite",
    },
  ]
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
  if (context.user) return redirect("/dashboard")

  return json({})
}

export default function Index() {
  return (
    <div className="container m-auto flex h-full w-full">
      <div className="mt-8 flex w-full flex-col justify-center gap-8 p-8">
        <div className="flex justify-center gap-2">
          <Button asChild>
            <a href="/api/auth/github">Login Github</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
