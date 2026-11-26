<?php

declare(strict_types=1);

namespace App\Bus\Contracts\Work;

use Closure;
use Illuminate\Database\ConnectionInterface;

/**
 * One transaction together with the events its rows raise: run() gives work a unit of its own, opened with the
 * transaction and published after its commit, and within() runs work inside the unit already open.
 */
interface UnitOfWork
{
    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @param  Closure(): void  $commit
     * @param  Closure(): void  $rollBack
     * @return TResult
     */
    public function run(
        ConnectionInterface $connection,
        string $owner,
        Closure $work,
        Closure $commit,
        Closure $rollBack,
    ): mixed;

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function within(ConnectionInterface $connection, Closure $work): mixed;
}
