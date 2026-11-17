<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Database\DatabaseManager;
use LogicException;

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
            throw new LogicException('The hook test database is only selected while testing.');
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
            throw new LogicException("The hook tests selected the database {$selected}, not ".self::NAME.'.');
        }
    }
}
