<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Access\Exceptions\StackLockTimedOut;
use App\Bus\SessionAdvisoryLocks;
use App\Support\StackOperationDeadline;
use Closure;
use Illuminate\Database\DatabaseManager;

/**
 * Runs one start request at a time per request id, as a PostgreSQL advisory lock in its own namespace: a session lock
 * taken in autocommit before the start's transaction, or a transaction lock when the start joins one already open.
 */
final readonly class StartRequestLock
{
    /**
     * The first key of every start request lock, so no other advisory lock of the database meets it.
     */
    public const int FIRST_LOCK_KEY = 410_027;

    public function __construct(
        private DatabaseManager $databases,
        private SessionAdvisoryLocks $locks,
        private StackOperationDeadline $deadline,
    ) {}

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     *
     * @throws StackLockTimedOut
     */
    public function hold(string $requestId, Closure $work): mixed
    {
        $connection = $this->databases->connection();

        if ($connection->transactionLevel() > 0) {
            $connection->select('SELECT pg_advisory_xact_lock(?, hashtext(?))', [self::FIRST_LOCK_KEY, $requestId]);

            return $work();
        }

        $this->locks->lock(self::FIRST_LOCK_KEY, $requestId, $this->deadline);

        try {
            return $work();
        } finally {
            $this->locks->unlock(self::FIRST_LOCK_KEY, $requestId);
        }
    }
}
