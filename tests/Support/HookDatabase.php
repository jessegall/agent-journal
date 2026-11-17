<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Database\DatabaseManager;

/**
 * Points a test at the dedicated Postgres database journal_hooks_test instead of phpunit.xml's SQLite default.
 * It never touches the application database; scripts/prepare-hook-test-database.sh creates the test database.
 */
final class HookDatabase
{
    public const NAME = 'journal_hooks_test';

    private const CONNECTION = 'hooks_test';

    public static function select(Application $app): void
    {
        if (! $app->environment('testing')) {
            throw HookDatabaseRefused::outsideTesting();
        }

        $config = $app->make('config');
        $config->set('database.connections.'.self::CONNECTION, [
            ...$config->get('database.connections.pgsql'),
            'database' => self::NAME,
        ]);
        $config->set('database.default', self::CONNECTION);

        $database = $app->make(DatabaseManager::class);
        $database->purge(self::CONNECTION);
        $selected = $database->connection()->getDatabaseName();

        if ($selected !== self::NAME) {
            throw HookDatabaseRefused::otherDatabase($selected);
        }
    }
}
