<?php

declare(strict_types=1);

namespace App\Bus;

use App\Access\Exceptions\StackLockTimedOut;
use App\Support\StackOperationDeadline;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\QueryException;

/**
 * PostgreSQL advisory locks held by the database session, keyed by a namespace and a text: taken within a deadline,
 * and given back so that a connection which cannot give one back is disconnected, never reused.
 */
final readonly class SessionAdvisoryLocks
{
    private const string LOCK_NOT_AVAILABLE = '55P03';

    public function __construct(private DatabaseManager $databases) {}

    /**
     * @throws StackLockTimedOut
     */
    public function lock(int $namespace, string $key, StackOperationDeadline $deadline): void
    {
        $connection = $this->databases->connection();
        $connection->statement("SET lock_timeout = '{$deadline->lockMilliseconds()}ms'");

        try {
            $connection->select('SELECT pg_advisory_lock(?, hashtext(?))', [$namespace, $key]);
        } catch (QueryException $failure) {
            if ($failure->getCode() === self::LOCK_NOT_AVAILABLE) {
                throw StackLockTimedOut::held($deadline->lockMilliseconds(), $failure);
            }

            throw $failure;
        } finally {
            $connection->statement('RESET lock_timeout');
        }
    }

    public function unlock(int $namespace, string $key): void
    {
        $connection = $this->databases->connection();

        $released = $connection->selectOne(
            'SELECT pg_advisory_unlock(?, hashtext(?)) AS released',
            [$namespace, $key],
        );

        if ($released?->released !== true) {
            $connection->disconnect();
        }
    }
}
