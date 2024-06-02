# Remix + Hono with Vite!

This is just demo project, pick what you need. This project includes:

- [x] api and client comunication with hono
- [x] github login
- [x] database with drizzle (auth and user table)
- [x] cookies auth (http only)
- [x] protected routes
- [x] hmr support
- [x] docker for deployment
- [x] tailwind as starter styling
- [x] validation (zod)
- [x] test
- [ ] cloudflare / vercel support

## Let's start with WHY

why I am doing this?, first of all, I just wanna create stack I want. when creating a website with react/remix/next.js, sometimes, I need to create some APIs to support other thing. However, I don't really enjoy creating APIs with Remix.js or Next.js because they lack certain features, and I prefer having more control over how I develop my APIs, for examples middleware, cookies, oauth, etc. so I created this stack, not something new, just reinvent the wheels.

With API being handled by Hono and remix just a middleware for hono, I can combine the best. I can build API as easily and enjoyably as I do with express or with any other framework, also combine it with frontend framework like react with SSR and frontend routing.

![arch](./docs/remix-vite-hono.png)

as you can see the project structure, I have so many directory just to do a simple things. so here the simple explanation:

`service` and `repository` form the inner circle of the project, backend logic goes here. `api` and `app` are in the outer circle, meaning they face the outside world. With this structure, I can use any `service` and `repository` wherever I need them, whether it's in `api` or `app` (through remix loaders/actions), because `service` and `repository` are independent of `api` or `app`. Other directories like `schema` and `utils` contain global files that can be accessed from anywhere. for examples, I use the same type and validation schema in api endpoint and on frontend with Tanstack Form.

One important thing to note: because Remix creates client and server bundles, make sure you don't import any files that belong to the server on the client side, such as database tables, environment variables, services, etc.

And last, when `app` (remix) need to do something with API, we can use `hono/client` instead calling API directly with axios or fetch, just to make life easier.

## Stack

- [remix](https://remix.run/) as frontend framework
- [vite](https://vitejs.dev) as bundler and dev server
- [drizzle](https://orm.drizzle.team/) + postgresql
- [hono](https://hono.dev/) for api server
