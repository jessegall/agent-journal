<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Processes\StatementDeadlines;
use App\Exceptions\StatementTimedOut;
use Closure;
use Illuminate\Database\DatabaseManager;
use Illuminate\Database\QueryException;

/**
 * Runs a search source's storage statements under a deadline the database itself enforces, so a slow statement is
 * cancelled instead of holding the request. On PostgreSQL it sets statement_timeout for the statements inside.
 */
final readonly class StatementDeadline implements StatementDeadlines
{
    private const string CANCELLED = '57014';

    public function __construct(private DatabaseManager $connections) {}

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $statements
     * @return TResult
     *
     * @throws StatementTimedOut
     */
    public function within(int $milliseconds, Closure $statements): mixed
    {
        $connection = $this->connections->connection();

        if ($connection->getDriverName() !== 'pgsql') {
            return $statements();
        }

        try {
            return $connection->transaction(function () use ($connection, $milliseconds, $statements): mixed {
                $connection->statement('SET LOCAL statement_timeout = '.max(1, $milliseconds));

                return $statements();
            });
        } catch (QueryException $failure) {
            if ($failure->getCode() !== self::CANCELLED) {
                throw $failure;
            }

            throw StatementTimedOut::after($milliseconds, $failure);
        }
    }
}
