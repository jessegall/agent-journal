<?php

declare(strict_types=1);

namespace App\Support;

use Closure;
use Illuminate\Database\ConnectionInterface;
use Throwable;

/**
 * Runs a read inside a database transaction that refuses every write, so an insert, update or delete fails at the
 * database whatever path it takes.
 */
final readonly class ReadOnlyTransaction
{
    public function __construct(private ConnectionInterface $database) {}

    /**
     * The read in its own read-only transaction. Inside a caller's transaction the read keeps that transaction's
     * mode: a transaction cannot turn read-only for one read and writable again.
     *
     * @template T
     *
     * @param  Closure(): T  $read
     * @return T
     */
    public function run(Closure $read): mixed
    {
        if ($this->database->transactionLevel() > 0) {
            return $read();
        }

        return $this->within('SET TRANSACTION READ ONLY', $read);
    }

    /**
     * The read in one read-only snapshot, every query seeing the same committed rows.
     *
     * @template T
     *
     * @param  Closure(): T  $read
     * @return T
     */
    public function runInOneSnapshot(Closure $read): mixed
    {
        return $this->within('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY', $read);
    }

    /**
     * @template T
     *
     * @param  Closure(): T  $read
     * @return T
     */
    private function within(string $mode, Closure $read): mixed
    {
        $this->database->beginTransaction();

        try {
            $this->database->statement($mode);
            $answer = $read();
            $this->database->commit();

            return $answer;
        } catch (Throwable $failure) {
            $this->database->rollBack();

            throw $failure;
        }
    }
}
