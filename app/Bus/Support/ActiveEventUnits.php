<?php

declare(strict_types=1);

namespace App\Bus\Support;

use Illuminate\Database\Connection;
use Illuminate\Database\ConnectionInterface;

/**
 * The event unit active for each database connection in this execution, scoped so an Octane request or a queued job
 * never sees another's; the capture asks it at each save.
 */
final class ActiveEventUnits
{
    /**
     * @var array<string, EventUnit>
     */
    private array $units = [];

    public function activeFor(ConnectionInterface $connection): EventUnit|null
    {
        return $this->units[self::nameOf($connection)] ?? null;
    }

    /**
     * Opens a fresh unit for the connection's transaction: the seam a transaction owner registers through.
     */
    public function open(ConnectionInterface $connection): EventUnit
    {
        return $this->units[self::nameOf($connection)] = new EventUnit();
    }

    public function close(ConnectionInterface $connection): void
    {
        unset($this->units[self::nameOf($connection)]);
    }

    private static function nameOf(ConnectionInterface $connection): string
    {
        return $connection instanceof Connection ? (string) $connection->getName() : $connection->getDatabaseName();
    }
}
