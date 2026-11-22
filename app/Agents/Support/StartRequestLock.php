<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Bus\Exceptions\StackLockTimedOut;
use App\Bus\Support\OperationDeadline;
use Closure;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\QueryException;

/**
 * Runs one start request at a time per request id, as a PostgreSQL advisory lock in its own namespace: a session lock
 * taken in autocommit before the start's transaction, or a transaction lock when the start joins one already open.
 */
final readonly class StartRequestLock
{
    /**
     * The first key of every start request lock, so no other advisory lock of the database meets it.
     */
    public const int NAMESPACE = 410_027;

    private const string LOCK_NOT_AVAILABLE = '55P03';

    public function __construct(
        private DatabaseManager $databases,
        private OperationDeadline $deadline,
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
            $connection->select('SELECT pg_advisory_xact_lock(?, hashtext(?))', [self::NAMESPACE, $requestId]);

            return $work();
        }

        $this->lock($requestId);

        try {
            return $work();
        } finally {
            $this->unlock($requestId);
        }
    }

    /**
     * @throws StackLockTimedOut
     */
    private function lock(string $requestId): void
    {
        $connection = $this->databases->connection();
        $connection->statement("SET lock_timeout = '{$this->deadline->lockMilliseconds()}ms'");

        try {
            $connection->select('SELECT pg_advisory_lock(?, hashtext(?))', [self::NAMESPACE, $requestId]);
        } catch (QueryException $failure) {
            if ($failure->getCode() === self::LOCK_NOT_AVAILABLE) {
                throw StackLockTimedOut::held($this->deadline->lockMilliseconds(), $failure);
            }

            throw $failure;
        } finally {
            $connection->statement('RESET lock_timeout');
        }
    }

    /**
     * A connection that cannot give the lock back is disconnected, never reused.
     */
    private function unlock(string $requestId): void
    {
        $connection = $this->databases->connection();

        $released = $connection->selectOne(
            'SELECT pg_advisory_unlock(?, hashtext(?)) AS released',
            [self::NAMESPACE, $requestId],
        );

        if ($released?->released !== true) {
            $connection->disconnect();
        }
    }
}
