import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard" },
    {
      name: "description",
      content: "Dashboard",
    },
  ];
};

export default function Dashboard() {
  return (
    <div className="w-full h-full m-auto container flex ">
      <div className="flex flex-col w-full justify-center  p-8 gap-8 mt-8">
        <div className="flex justify-center gap-2">dashboard</div>
      </div>
    </div>
  );
}
