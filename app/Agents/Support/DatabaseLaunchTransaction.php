<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Contracts\LaunchTransaction;
use Closure;
use Illuminate\Database\ConnectionInterface;

/**
 * A plain database transaction, used while no other domain supplies a launch transaction.
 */
final readonly class DatabaseLaunchTransaction implements LaunchTransaction
{
    public function __construct(private ConnectionInterface $database) {}

    public function run(Closure $work): mixed
    {
        return $this->database->transaction($work);
    }
}
