FROM node:24-bookworm-slim AS node

# journal-agent, the protected agent host, built from tools/journal-agent for the runner image. The modules are
# downloaded from go.mod and go.sum alone, and both Go caches live in BuildKit cache mounts, so a code change compiles
# only the packages it touched.
FROM golang:1.26.4-bookworm AS agent-host
WORKDIR /src
COPY tools/journal-agent/go.mod tools/journal-agent/go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download
COPY tools/journal-agent/ ./
RUN --mount=type=cache,target=/go/pkg/mod --mount=type=cache,target=/root/.cache/go-build CGO_ENABLED=0 go build -o /out/journal-agent ./cmd/journal-agent

# Tunler for the share service, built from one pinned commit whose source archive must match its checksum; see
# docs/sharing/binaries.md for how the commit and the sum were checked.
FROM golang:1.26.4-bookworm AS tunler
ARG TUNLER_VERSION=v0.2.2
ARG TUNLER_COMMIT=7ddb5d59947f27b06a1801c17af5a62adadd043a
ARG TUNLER_SOURCE_SHA256=644d40a7fd90afdd14bd51f60b3e1862e1edcf5d32d6272fc7d32c44dcb0c0bb
RUN curl -fsSL -o /tmp/tunler.tar.gz "https://codeload.github.com/jessegall/tunler/tar.gz/${TUNLER_COMMIT}" \
    && echo "${TUNLER_SOURCE_SHA256}  /tmp/tunler.tar.gz" | sha256sum -c - \
    && tar -xzf /tmp/tunler.tar.gz -C /tmp \
    && cd "/tmp/tunler-${TUNLER_COMMIT}" \
    && CGO_ENABLED=0 go build -ldflags "-s -w -X main.version=${TUNLER_VERSION}" -o /out/tunler ./cmd/tunler

# ngrok for the share service, one pinned release per architecture, each archive matching its checksum.
FROM debian:bookworm-slim AS ngrok
ARG TARGETARCH
ARG NGROK_VERSION=3.39.13
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    rm -f /etc/apt/apt.conf.d/docker-clean && apt-get update && apt-get install -y --no-install-recommends ca-certificates curl \
    && case "${TARGETARCH}" in \
        amd64) url="https://bin.equinox.io/a/h2cqbjsNLj7/ngrok-v3-${NGROK_VERSION}-linux-amd64.tar.gz"; sum="233e0647849913e6404150c1e9c5e4f31c1368aefee330958d038d7afecb8f2e" ;; \
        arm64) url="https://bin.equinox.io/a/j83dYTwHiq9/ngrok-v3-${NGROK_VERSION}-linux-arm64.tar.gz"; sum="fb41ee8f251969f6e399ef03122f791ae537155dfd9ac4c0baf108aca95c17d7" ;; \
        *) echo "ngrok is pinned for amd64 and arm64 only, not ${TARGETARCH}" >&2; exit 1 ;; \
    esac \
    && curl -fsSL -o /tmp/ngrok.tar.gz "${url}" \
    && echo "${sum}  /tmp/ngrok.tar.gz" | sha256sum -c - \
    && mkdir -p /out && tar -xzf /tmp/ngrok.tar.gz -C /out ngrok

# PHP with the journal's extensions and Composer, and nothing of the journal: it changes only with the PHP version or
# the extension list, so every later stage starts from its cache.
FROM dunglas/frankenphp:1-php8.6 AS php

RUN install-php-extensions pcntl pdo_pgsql intl zip bcmath opcache mbstring

# git for the journal-check executable and its tests, which build temporary repositories
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    rm -f /etc/apt/apt.conf.d/docker-clean && apt-get update && apt-get install -y --no-install-recommends git

# phpredis from its development branch with its submodules: its PECL release does not build against PHP 8.6 yet
RUN git clone --depth 1 --recurse-submodules --shallow-submodules https://github.com/phpredis/phpredis /tmp/phpredis \
    && cd /tmp/phpredis && phpize && ./configure && make -j"$(nproc)" && make install \
    && docker-php-ext-enable redis && rm -rf /tmp/phpredis

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# The Composer packages, from composer.json and composer.lock alone: a code change never reinstalls them.
FROM php AS vendor

COPY composer.json composer.lock ./
RUN --mount=type=cache,target=/root/.cache/composer COMPOSER_CACHE_DIR=/root/.cache/composer \
    composer install --no-interaction --prefer-dist --no-scripts --no-autoloader

# The npm packages, from package.json and package-lock.json alone.
FROM node AS node-modules

WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# The journal's PHP console: the packages and the code, with no frontend build. The app and the runner image build on
# it, so there is one PHP setup.
FROM php AS console

COPY --from=vendor /app/vendor ./vendor
COPY . .
RUN composer dump-autoload --optimize

# What the frontend build reads, gathered into /frontend: the files PHP generates (the UI manifest, the routes and the
# types), resources/ and each domain's component folder. A code change that leaves all of them as they were leaves the
# frontend build below cached, since a copy from another stage is compared by content.
FROM console AS frontend-sources

RUN php artisan journal:ui-manifest \
    && php artisan wayfinder:generate --with-form \
    && php -d memory_limit=512M artisan typescript:transform \
    && mkdir /frontend \
    && cp -R --parents package.json package-lock.json vite.config.ts vite.sharing.config.ts vite.domains.ts \
        tsconfig.json tsconfig.domains.json scripts/check-domain-imports.mjs resources \
        vendor/laravel/framework/src/Illuminate/Pagination/resources/views /frontend \
    && php -r 'foreach (json_decode(file_get_contents("resources/js/generated/domain-roots.json"), true)["owners"] as $folder) { echo $folder, PHP_EOL; }' \
        | xargs -I{} cp -R --parents {} /frontend

# The frontend build, in Node alone: the routes are already generated, so the Wayfinder plugin does not call PHP.
FROM node-modules AS frontend

COPY --from=frontend-sources /frontend/ ./

# The websocket address the browser connects to is built into the frontend: a server passes its public one, and the
# image never sees the .env it comes from.
ARG VITE_REVERB_APP_KEY=""
ARG VITE_REVERB_HOST=""
ARG VITE_REVERB_PORT=""
ARG VITE_REVERB_SCHEME=""
RUN WAYFINDER_GENERATED=1 npm run build:frontend

# Local development on the Mac: the console with Node and the npm packages, for the Vite dev server and the frontend
# commands run in the app container. The source is mounted over /app.
FROM console AS development

# python3 for the tests that run the installation's own scripts against a stand-in Docker
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    rm -f /etc/apt/apt.conf.d/docker-clean && apt-get update && apt-get install -y --no-install-recommends python3

COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx
COPY --from=node-modules /app/node_modules ./node_modules

EXPOSE 8000

CMD ["php", "artisan", "octane:frankenphp", "--host=0.0.0.0", "--port=8000", "--caddyfile=.docker/app/Caddyfile"]

# The served application: the console and the built frontend, with no Node.
FROM console AS app

COPY --from=frontend /app/public/build ./public/build
COPY --from=frontend /app/public/build-sharing ./public/build-sharing

EXPOSE 8000

CMD ["php", "artisan", "octane:frankenphp", "--host=0.0.0.0", "--port=8000", "--caddyfile=.docker/app/Caddyfile"]

# The share service: the same application with the pinned gateway programs, run by the sharing supervisor as its first
# process. It publishes no port; a gateway reaches the share-only listener on loopback.
FROM app AS share

COPY --from=tunler /out/tunler /opt/sharing/bin/tunler
COPY --from=ngrok /out/ngrok /opt/sharing/bin/ngrok

CMD ["php", "artisan", "sharing:supervise"]

# The runner's tools, apart from the journal's code: the pinned claude and codex, journal-agent, the Docker client and
# the service user and folders. A code change leaves this stage cached.
FROM php AS runner-tools

ARG CLAUDE_CODE_VERSION=2.1.323
ARG CODEX_VERSION=0.165.0

RUN --mount=type=cache,target=/root/.npm --mount=type=cache,target=/var/cache/apt,sharing=locked --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    rm -f /etc/apt/apt.conf.d/docker-clean && apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates nodejs npm \
    && npm install -g "@anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}" "@openai/codex@${CODEX_VERSION}" \
    && apt-get purge -y npm && apt-get autoremove -y

# The Docker client the contained agent host starts containers with, on the agent daemon only.
COPY --from=docker:28-cli /usr/local/bin/docker /usr/local/bin/docker

# Compose cannot chown a named volume: a volume mounted on an empty folder of the image takes its owner and mode on
# first use, so the agent host's state and start socket folders and the accounts folder are made here, owner-only for
# 10001.
RUN groupadd --gid 10001 journal \
    && useradd --uid 10001 --gid 10001 --home-dir /home/journal --no-create-home journal \
    && mkdir -p /var/lib/journal-host /run/journal-start /srv/journal/accounts \
    && chown 10001:10001 /var/lib/journal-host /run/journal-start /srv/journal/accounts \
    && chmod 0700 /var/lib/journal-host /run/journal-start /srv/journal/accounts

COPY --from=agent-host /out/journal-agent /usr/local/bin/journal-agent

# The runner image: the tools above and the console with no .env. The agent-host, agent-host-enroll and accounts
# services each give it their command; it has no entrypoint of its own and runs as 10001:10001.
FROM runner-tools AS runner

# The code is copied with the modes it has where it was built, where some files may be private: it is made readable,
# and only storage and the bootstrap cache writable, for the user the services run as.
COPY --from=console --chmod=a+rX /app /app
RUN rm -f /app/.env \
    && chown -R 10001:10001 /app/storage /app/bootstrap/cache
USER 10001:10001
ENTRYPOINT []
CMD []
