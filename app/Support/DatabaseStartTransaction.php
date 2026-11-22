<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Sessions\StartTransaction;
use Closure;
use Illuminate\Database\ConnectionInterface;

/**
 * A plain database transaction, used while no other domain supplies a start transaction.
 */
final readonly class DatabaseStartTransaction implements StartTransaction
{
    public function __construct(private ConnectionInterface $database) {}

    public function run(Closure $work): mixed
    {
        return $this->database->transaction($work);
    }

    public function runForSession(string $sessionId, Closure $work): mixed
    {
        return $this->run($work);
    }
}
