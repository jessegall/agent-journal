<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Support\ActorContext;
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
    public function within(ActorContext $actor, AuthoritySource $authority, Closure $work): mixed;
}
