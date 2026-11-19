# Worker threads follow the load

The `app` service runs Laravel Octane on FrankenPHP. Octane starts FrankenPHP with the project's own Caddyfile,
`.docker/app/Caddyfile`, a copy of Octane's with one addition: `max_threads`.

- **The floor.** At boot FrankenPHP starts its worker threads, two per processor unless `octane:frankenphp --workers`
  names a number. These threads are never removed.
- **Growing.** When a request has waited about 5 ms for a free thread and the processors are at most 80% busy,
  FrankenPHP starts another worker thread, up to `max_threads`.
- **Shrinking.** A thread started that way stops again after 5 seconds without work.
- **The ceiling.** `OCTANE_MAX_THREADS` sets `max_threads` (default 32, in `compose.yaml`). Size it at about one thread
  per two actors that are active at once (agents and signed-in users), and never below the floor, because FrankenPHP
  refuses to start with a ceiling under the threads it starts at boot. `auto` lets FrankenPHP estimate the ceiling from
  the memory limit.

Nothing reloads the server to change the count: Octane's own reload sends the running configuration back unchanged, so
a new ceiling needs the `app` service restarted (`docker compose -p agent-journal-6 up -d app`). FrankenPHP grows on
waiting requests and processor use, not on a count of actors, so the actor count only guides the ceiling.

Checked with `frankenphp adapt --config .docker/app/Caddyfile` (FrankenPHP 1.13.6): `OCTANE_MAX_THREADS=12` gives
`"max_threads": 12` in the running configuration, and `auto` gives `-1`, FrankenPHP's own estimate. Source: report 204.
