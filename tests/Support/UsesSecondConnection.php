<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Database\Connection;
use Illuminate\Support\Facades\DB;

/**
 * A second database connection to the test database, for a test that races two sessions; it is closed after the test.
 */
trait UsesSecondConnection
{
    private const string SECOND_CONNECTION = 'second_session';

    /**
     * The second session, opened on first use; a lock wait in it gives up after the timeout when one is given.
     */
    private function otherConnection(string|null $lockTimeout = null): Connection
    {
        $config = $this->app->make('config');
        $config->set(
            'database.connections.'.self::SECOND_CONNECTION,
            $config->get('database.connections.'.$config->get('database.default')),
        );

        $other = DB::connection(self::SECOND_CONNECTION);

        if ($lockTimeout !== null) {
            $other->statement("SET lock_timeout = '{$lockTimeout}'");
        }

        return $other;
    }

    /**
     * Closes the second session before any other cleanup runs, so a transaction a failed test left open in it never
     * holds the locks the table cleanup waits for.
     */
    protected function setUpUsesSecondConnection(): void
    {
        array_unshift($this->beforeApplicationDestroyedCallbacks, function (): void {
            if ($this->app->make('config')->has('database.connections.'.self::SECOND_CONNECTION)) {
                DB::connection(self::SECOND_CONNECTION)->disconnect();
            }
        });
    }
}
