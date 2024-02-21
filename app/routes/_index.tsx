import { useState } from "react";
import { useLoaderData } from "@remix-run/react";
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { getUser } from "service/user";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const user = context.user;

  let userFull;

  if (user?.id) {
    console.log(user.id);
    userFull = await getUser(user.id);
  }

  return json({ user: user, userFull: userFull?.value });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  console.log(data);

  const [first, setfirst] = useState<number | string>(0);

  // useEffect(() => {
  //   getAuthors("test-id")
  //     .then((res) => res.json())
  //     .then((r) => {
  //       console.log(r);

  //       setfirst(r);
  //     });
  // }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 style={{ color: "blue" }}>HMR Check</h1>
      <h3>{first}</h3>
      <button onClick={() => setfirst(Math.random())}>check</button>
      <div>{JSON.stringify(data)}</div>
      <div>{JSON.stringify(data.userFull)}</div>
    </div>
  );
}
