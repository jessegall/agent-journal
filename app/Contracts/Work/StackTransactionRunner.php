<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use Closure;

/**
 * Runs a domain's stack change in one transaction with its lock and time limits set first, so the domain write and the
 * stack push commit together or not at all. Inside a transaction that already has its limits it joins it.
 */
interface StackTransactionRunner
{
    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function run(Closure $work): mixed;
}
