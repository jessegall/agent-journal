<?php

declare(strict_types=1);

namespace App\Core\Agents;

use App\Core\Contracts\LaunchTransaction;
use Closure;
use Illuminate\Database\ConnectionInterface;

/**
 * A plain database transaction, used while no other domain supplies a launch transaction.
 */
final readonly class PlainLaunchTransaction implements LaunchTransaction
{
    public function __construct(private ConnectionInterface $database) {}

    public function run(Closure $work): mixed
    {
        return $this->database->transaction($work);
    }
}
