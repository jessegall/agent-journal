<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Database\ConnectionInterface;

/**
 * Deletes the receipts, credentials, sessions and agents a test committed outside its transaction, after the test.
 */
trait ClearsStartRows
{
    protected function tearDownClearsStartRows(): void
    {
        $database = $this->app->make(ConnectionInterface::class);

        foreach (['command_receipts', 'session_tokens', 'agent_sessions', 'agents'] as $table) {
            $database->table($table)->delete();
        }
    }
}
