<?php

declare(strict_types=1);

namespace App\Support;

use App\Exceptions\EngineConnectionLost;
use Illuminate\Database\Connection;
use Illuminate\Database\DatabaseManager;

/**
 * The engine lock as a PostgreSQL session advisory lock on the engine's own connection, which never reconnects. The
 * raw SQL here touches no table: it is lock coordination, the one documented exception to query-builder-only access.
 */
final class AdvisoryEngineLock
{
    private int|null $ownerBackendId = null;

    public function __construct(
        private readonly DatabaseManager $databases,
        private readonly EngineSettings $settings,
    ) {}

    public function acquire(): void
    {
        $connection = $this->connection();
        $connection->statement('select pg_advisory_lock(?)', [$this->settings->lockKey]);
        $this->ownerBackendId = (int) $connection->scalar('select pg_backend_pid()');
    }

    public function isHeld(): bool
    {
        if ($this->ownerBackendId === null) {
            return false;
        }

        try {
            return (bool) $this->connection()->scalar(
                "select exists (select 1 from pg_locks where locktype = 'advisory' and granted and pid = pg_backend_pid() and pid = ? and classid = ? and objid = ? and objsubid = 1)",
                [
                    $this->ownerBackendId,
                    ($this->settings->lockKey >> 32) & 0xFFFFFFFF,
                    $this->settings->lockKey & 0xFFFFFFFF,
                ],
            );
        } catch (EngineConnectionLost) {
            // A lost session has lost its lock with it; the next query on the connection fails the same way.
            $this->ownerBackendId = null;

            return false;
        }
    }

    public function release(): void
    {
        if ($this->ownerBackendId === null) {
            return;
        }

        $this->connection()->statement('select pg_advisory_unlock(?)', [$this->settings->lockKey]);
        $this->ownerBackendId = null;
    }

    /**
     * The engine connection, with its reconnector replaced so a lost session ends the engine instead of reconnecting.
     */
    private function connection(): Connection
    {
        $connection = $this->databases->connection($this->settings->connection);
        $connection->setReconnector(EngineConnectionLost::throwing()->onConnection($this->settings->connection));

        return $connection;
    }
}
