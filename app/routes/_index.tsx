import { getUser } from "service/user";
import { Button } from "~/components/ui/button";
import { useLoaderData } from "@remix-run/react";
import {
  json,
  type MetaFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App with Hono backend and vite" },
    {
      name: "description",
      content: "Welcome to New Remix App with Hono backend and vite",
    },
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  if (!context.user) return json({ user: null });

  const user = await getUser(context.user.id);

  if (user.error) return json({ user: null });

  return json({ user: user.value });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="absolute w-full h-full flex items-center justify-center">
      <div className="flex flex-col max-w-sm gap-4 justify-center">
        <div className="font-mono text-xs">
          <code className="whitespace-pre-line ">
            {data.user ? JSON.stringify(data.user) : ""}
          </code>
        </div>
        <div className="flex justify-center gap-2">
          {!data.user && (
            <Button asChild>
              <a href="/api/auth/github">Login Github</a>
            </Button>
          )}
          {data.user && (
            <Button variant="destructive" asChild>
              <a href="/api/auth/logout">Logout</a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
