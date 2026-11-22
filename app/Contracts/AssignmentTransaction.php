<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Exceptions\AssignmentRetryExhausted;
use App\Exceptions\AssignmentTransactionRequired;
use Closure;

/**
 * Runs assignment work in one repeatable-read transaction, so every read sees one snapshot. A conflict between two
 * transactions runs the whole work again, at most three times in all; the work must only touch the database. Work
 * inside an open repeatable-read transaction joins it without retrying; any other open transaction is refused.
 */
interface AssignmentTransaction
{
    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     *
     * @throws AssignmentTransactionRequired
     * @throws AssignmentRetryExhausted
     */
    public function run(Closure $work): mixed;

    /**
     * Refuses unless a repeatable-read transaction is open, as the command bus opens one for every assignment command.
     *
     * @throws AssignmentTransactionRequired
     */
    public function assertOpen(): void;
}
