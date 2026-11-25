<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Contracts\Authorization\AuthoritySource;
use App\Support\ActorIdentity;
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
    public function within(ActorIdentity $actor, AuthoritySource $authority, Closure $work): mixed;
}
