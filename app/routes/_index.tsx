import { toast } from "sonner";
import { User } from "config/schema";
import { getUser } from "service/user";
import { useEffect, useState } from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { Button } from "~/components/ui/button";
import { Toaster } from "~/components/ui/sonner";
import { useLoaderData } from "@remix-run/react";
import { getUser as getUserRPPC, updateUser } from "~/rpc/user";
import { valibotValidator } from "@tanstack/valibot-form-adapter";
import { UpdateUserSchema, updateUserSchema } from "validator/user";
import {
  json,
  type MetaFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { removeEmpty } from "utils/utils";

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

  const form = useForm({
    validatorAdapter: valibotValidator,
    defaultValues: removeEmpty(data.user || {}) as UpdateUserSchema,
    onSubmit: async ({ value }) => {
      await updateUser(value);

      toast.success("success send data to HONO RPC");
    },
  });

  useEffect(() => {
    getUserRPPC().then((r) => setDataFromRPC(r));
  }, []);

  return (
    <>
      <div className="w-full h-full m-auto container flex ">
        <div className="flex flex-col w-full justify-center p-8 gap-8 mt-8">
          <div className="flex flex-col lg:flex-row gap-2">
            <div className=" border border-border overflow-hidden p-2 text-xs flex-1 flex flex-col gap-2">
              <div>Data from loader (server)</div>
              <code className="font-mono whitespace-pre ">
                {data.user ? JSON.stringify(data.user, null, 2) : ""}
              </code>
            </div>
            <div className=" border border-border overflow-hidden p-2 text-xs flex-1 flex flex-col gap-2">
              <div>Data from HONO RPC (client)</div>
              <code className="font-mono whitespace-pre ">
                {dataFromRPC ? JSON.stringify(dataFromRPC, null, 2) : ""}
              </code>
            </div>
          </div>
          {data.user && (
            <div className="flex flex-col lg:flex-row gap-2">
              <div className="border border-border p-2 flex-1 flex flex-col gap-2">
                <form.Provider>
                  <form.Field
                    name="user_name"
                    validators={{
                      onChange: updateUserSchema.entries.user_name,
                    }}
                  >
                    {(field) => {
                      return (
                        <>
                          <Input
                            placeholder="Username"
                            onBlur={field.handleBlur}
                            value={field.state.value as string}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <Label className="text-destructive">
                            {field.state.meta.errors}
                          </Label>
                        </>
                      );
                    }}
                  </form.Field>
                  <form.Field
                    name="email"
                    validators={{ onChange: updateUserSchema.entries.email }}
                  >
                    {(field) => {
                      return (
                        <>
                          <Input
                            type="email"
                            placeholder="email"
                            onBlur={field.handleBlur}
                            value={field.state.value as string}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <Label className="text-destructive">
                            {field.state.meta.errors}
                          </Label>
                        </>
                      );
                    }}
                  </form.Field>
                  <form.Field
                    name="full_name"
                    validators={{
                      onChange: updateUserSchema.entries.full_name,
                    }}
                  >
                    {(field) => (
                      <>
                        <Input
                          placeholder="Full Name"
                          onBlur={field.handleBlur}
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <Label className="text-destructive">
                          {field.state.meta.errors}
                        </Label>
                      </>
                    )}
                  </form.Field>
                  <form.Field
                    name="bio"
                    validators={{ onChange: updateUserSchema.entries.bio }}
                  >
                    {(field) => {
                      return (
                        <>
                          <Input
                            placeholder="Bio"
                            onBlur={field.handleBlur}
                            value={field.state.value as string}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                          <Label className="text-destructive">
                            {field.state.meta.errors}
                          </Label>
                        </>
                      );
                    }}
                  </form.Field>
                  <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                  >
                    {([canSubmit, isSubmitting]) => (
                      <Button
                        disabled={!canSubmit || isSubmitting}
                        onClick={() => form.handleSubmit()}
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    )}
                  </form.Subscribe>
                </form.Provider>
              </div>
            </div>
          )}
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
      <Toaster richColors />
    </>
  );
}
