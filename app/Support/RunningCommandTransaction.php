<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\CommandTransaction;
use App\Exceptions\CommandTransactionMissing;
use Illuminate\Database\Connection;
use Illuminate\Database\ConnectionInterface;

/**
 * The bus's own answer: a command runs and the connection is the bus's, inside the transaction the bus opened, which
 * a nested command joins. It never opens, commits or retries a transaction.
 */
final readonly class RunningCommandTransaction implements CommandTransaction
{
    public function __construct(private RunningCommand $running, private ConnectionInterface $database) {}

    public function assertRunning(Connection $connection): void
    {
        if (! $this->running->isRunning() || $connection !== $this->database || $connection->transactionLevel() === 0) {
            throw CommandTransactionMissing::for((string) $connection->getName());
        }
    }
}
