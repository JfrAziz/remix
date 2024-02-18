import { getAuthors } from "~/rpc/authors";
import { useEffect, useState } from "react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [first, setfirst] = useState<number | string>(0);

  useEffect(() => {
    getAuthors("test-id")
      .then((res) => res.json())
      .then((r) => {
        console.log(r);

        setfirst(r);
      });
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 style={{ color: "blue" }}>HMR Check</h1>
      <h3>{first}</h3>
      <button onClick={() => setfirst(Math.random())}>check</button>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
