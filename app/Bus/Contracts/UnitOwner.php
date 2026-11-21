<?php

declare(strict_types=1);

namespace App\Bus\Contracts;

use Closure;
use Illuminate\Database\ConnectionInterface;

/**
 * What a transaction owner does with the event unit of its transaction, and what a command joining it does.
 */
interface UnitOwner
{
    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @param  Closure(): void  $commit
     * @param  Closure(): void  $rollBack
     * @return TResult
     */
    public function own(
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
