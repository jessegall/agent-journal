<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Exceptions\StatementTimedOut;
use Closure;

/**
 * Runs storage statements under a deadline the database enforces, so a slow statement is cancelled.
 */
interface StatementDeadlines
{
    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $statements
     * @return TResult
     *
     * @throws StatementTimedOut
     */
    public function within(int $milliseconds, Closure $statements): mixed;
}
