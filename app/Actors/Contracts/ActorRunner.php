<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Access\Contracts\AuthoritySource;
use App\Support\ActorReference;
use Closure;

/**
 * Runs work under an authenticated actor and authority already captured by Core.
 */
interface ActorRunner
{
    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function within(ActorReference $actor, AuthoritySource $authority, Closure $work): mixed;
}
