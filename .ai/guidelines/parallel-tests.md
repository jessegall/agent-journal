# Running the whole suite

- `composer test` runs Pint and PHPStan, then the whole suite in parallel with fresh worker databases (`php artisan test --parallel --recreate-databases`). Pass overrides to `composer test:run`, never to `composer test`: `composer test:run -- --processes=2` or `composer test:run -- --filter=ClaudeCodeHooksTest`.
- Each parallel worker runs on its own database `journal_hooks_test_test_<n>`; these databases are expected to stay after a run, and the next run recreates them.
