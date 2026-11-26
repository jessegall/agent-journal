<?php

declare(strict_types=1);

namespace App\Access\Contracts;

use App\Access\Values\FrameGrant;
use App\Actors\Contracts\Actor;
use App\Values\StackTarget;
use Closure;
use PhpOption\Option;

/**
 * Whether the engine, acting in this operation, was granted the stack it is about to change; the engine supplies it.
 */
interface EngineTargetAccess
{
    /**
     * @return Option<FrameGrant>
     */
    public function frameGrantFor(Actor $actor): Option;

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function withinFrameGrant(FrameGrant $grant, Closure $work): mixed;

    /**
     * Refuses a target the engine's current grant does not cover.
     */
    public function assertTargetGranted(StackTarget $target): void;
}
