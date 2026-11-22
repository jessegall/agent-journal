<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

use App\Exceptions\CommandTransactionMissing;
use Illuminate\Database\Connection;

/**
 * Tells whether the work at hand runs inside the transaction of a bus command, opened or joined by the bus.
 */
interface CommandTransaction
{
    /**
     * Refuses unless a bus command is running and the connection's transaction is that command's.
     *
     * @throws CommandTransactionMissing
     */
    public function assertRunning(Connection $connection): void;
}
