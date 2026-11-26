<?php

declare(strict_types=1);

namespace App\Bus;

use App\Bus\Contracts\CommandTransaction as CommandTransactionContract;
use App\Exceptions\CommandTransactionMissing;
use Illuminate\Database\Connection;
use Illuminate\Database\ConnectionInterface;

/**
 * The bus's own answer: a command runs and the connection is the bus's, inside the transaction the bus opened, which
 * a nested command joins. It never opens, commits or retries a transaction.
 */
final readonly class CommandTransaction implements CommandTransactionContract
{
    public function __construct(private RunningCommand $running, private ConnectionInterface $database) {}

    public function assertRunning(Connection $connection): void
    {
        if (! $this->running->isRunning() || $connection !== $this->database || $connection->transactionLevel() === 0) {
            throw CommandTransactionMissing::for((string) $connection->getName());
        }
    }
}
