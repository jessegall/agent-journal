# Secrets of the contained arrangement

Files here are read by compose as secrets and are never committed.

- `journal_host_secret`: the host secret `php artisan agents:host-enroll <name> --contained` printed once, alone on one line, mode 0600.
