FROM php AS console
COPY . .
RUN --mount=type=cache,target=/root/.cache/composer composer install
RUN npm ci
