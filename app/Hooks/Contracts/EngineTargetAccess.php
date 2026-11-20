<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Actors\Contracts\Actor;
use App\Agents\Support\StackTarget;
use App\Hooks\Values\FrameGrant;
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
     * @param Closure(): TResult $work
     * @return TResult
     */
    public function withinFrameGrant(FrameGrant $grant, Closure $work): mixed;

    /**
     * Refuses a target the engine's current grant does not cover.
     */
    public function checkTarget(StackTarget $target): void;
}
