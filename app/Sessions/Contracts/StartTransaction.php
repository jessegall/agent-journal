<?php

declare(strict_types=1);

namespace App\Sessions\Contracts;

use Closure;

/**
 * The transaction a start runs in. Agents owns this contract so the domain that keeps the stacks can supply a bounded
 * one.
 */
interface StartTransaction
{
    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function run(Closure $work): mixed;

    /**
     * Runs the work for one session's stack, admitted to that stack first when the stacks keep an admission.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function runForSession(string $sessionId, Closure $work): mixed;
}
