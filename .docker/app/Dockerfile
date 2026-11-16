FROM node:24-bookworm-slim AS node

FROM dunglas/frankenphp:1-php8.5

RUN install-php-extensions pcntl pdo_pgsql redis intl zip bcmath opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Node runs in the same image as PHP: the Wayfinder Vite plugin calls php artisan while building.
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s /usr/local/lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --no-scripts --no-autoloader

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN composer dump-autoload --optimize && npm run build

EXPOSE 8000

CMD ["php", "artisan", "octane:frankenphp", "--host=0.0.0.0", "--port=8000"]
