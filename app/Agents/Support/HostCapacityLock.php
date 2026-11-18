<?php

declare(strict_types=1);

namespace App\Agents\Support;

use Illuminate\Database\DatabaseManager;

/**
 * Serializes capacity reservations on this host: one transaction-scoped advisory lock, released with the transaction,
 * so two launches never both fit into the same free room.
 */
final readonly class HostCapacityLock
{
    private const int LOCK_KEY = 7_304_211_005;

    public function __construct(private DatabaseManager $databases) {}

    public function holdUntilCommit(): void
    {
        $this->databases->connection()->statement('select pg_advisory_xact_lock(?)', [self::LOCK_KEY]);
    }
}
