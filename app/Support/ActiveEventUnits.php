<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\FactStaging;
use App\Exceptions\OverlappingTransactionOwner;
use Illuminate\Database\Connection;
use Illuminate\Database\ConnectionInterface;
use PhpOption\Option;

/**
 * The event unit active for each database connection in this execution, scoped so an Octane request or a queued job
 * never sees another's; the capture asks it at each save. Laravel shares one transaction manager across connections,
 * so only one connection's owner may hold a unit at a time.
 */
final class ActiveEventUnits
{
    /**
     * @var array<string, EventUnit>
     */
    private array $units = [];

    public function __construct(private readonly FactStaging $staging) {}

    /**
     * The unit open for the connection's transaction, if an owner opened one.
     *
     * @return Option<EventUnit>
     */
    public function activeFor(ConnectionInterface $connection): Option
    {
        return Option::fromValue($this->units[self::nameOf($connection)] ?? null);
    }

    /**
     * Opens a fresh unit for the connection's transaction: the seam a transaction owner registers through.
     */
    public function open(ConnectionInterface $connection): EventUnit
    {
        $name = self::nameOf($connection);
        $open = array_keys($this->units);

        if ($open !== [] && $open !== [$name]) {
            throw OverlappingTransactionOwner::on($name, $open[0]);
        }

        return $this->units[$name] = new EventUnit($this->staging);
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
