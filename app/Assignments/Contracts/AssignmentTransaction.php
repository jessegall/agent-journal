<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Exceptions\AssignmentRetryExhausted;
use App\Assignments\Exceptions\AssignmentTransactionRequired;
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
}
