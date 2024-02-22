import { User } from "config/schema";
import { getUser } from "service/user";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { useLoaderData } from "@remix-run/react";
import { getUser as getUserRPPC } from "~/rpc/user";
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

  const [dataFromRPC, setDataFromRPC] =
    useState<Omit<User, "created_at" | "updated_at">>();

  useEffect(() => {
    getUserRPPC().then((r) => setDataFromRPC(r));
  }, []);

  return (
    <div className="absolute w-full h-full flex items-center justify-center">
      <div className="flex flex-col max-w-sm gap-4 justify-center">
        <div className="text-xs flex flex-col gap-2">
          <div>Data from loader</div>
          <code className="font-mono  whitespace-pre-line ">
            {data.user ? JSON.stringify(data.user) : ""}
          </code>
        </div>
        <div className="text-xs flex flex-col gap-2">
          <div>Data from HONO RPC</div>
          <code className="font-mono  whitespace-pre-line ">
            {dataFromRPC ? JSON.stringify(dataFromRPC) : ""}
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
