FROM node:20-slim AS base
RUN corepack enable

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app
COPY . ./

FROM base AS build-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build

FROM base AS production-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM node:20-slim AS production
RUN corepack enable

WORKDIR /app
COPY --from=build-deps /app/build /app/build
COPY --from=production-deps /app/node_modules /app/node_modules
COPY package.json /app

EXPOSE 3000

CMD [ "pnpm", "start" ]
