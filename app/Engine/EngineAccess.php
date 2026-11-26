<?php

declare(strict_types=1);

namespace App\Engine;

use App\Access\Contracts\EngineGrant;
use App\Access\Contracts\EngineTargetAccess;
use App\Access\Contracts\MaintenanceAdmission;
use App\Access\Values\FrameGrant;
use App\Actors\Contracts\Actor;
use App\Actors\SystemActor;
use App\Engine\Exceptions\EngineAccessRefused;
use App\Projects\CurrentProject;
use App\Support\ActorReference;
use App\Values\StackTarget;
use Closure;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * What the engine may address in this operation, one grant at a time: a frame's target or a listener's declared
 * maintenance capability. It starts with no grant, so everything is refused until the engine grants something.
 */
final class EngineAccess implements EngineTargetAccess, MaintenanceAdmission
{
    private EngineGrant|FrameGrant $grant;

    public function __construct(private readonly CurrentProject $projects)
    {
        $this->grant = new NoEngineGrant();
    }

    public function grantFrame(StackTarget $target, string $frameId): void
    {
        $this->grant = new FrameGrant($target, $frameId);
    }

    public function grantMaintenance(string $capability): void
    {
        $this->grant = new MaintenanceGrant($capability);
    }

    public function frameGrantFor(Actor $actor): Option
    {
        if (! $this->grant instanceof FrameGrant) {
            return None::create();
        }

        $owner = ActorReference::of(new SystemActor());

        if ($owner->isSameAs(ActorReference::of($actor))) {
            return new Some($this->grant);
        }

        return None::create();
    }

    public function withinFrameGrant(FrameGrant $grant, Closure $work): mixed
    {
        return $this->withinGrant($grant, fn (): mixed => $this->projects->forTarget($grant->target, $work));
    }

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function withinMaintenance(string $capability, Closure $work): mixed
    {
        return $this->withinGrant(new MaintenanceGrant($capability), $work);
    }

    public function clear(): void
    {
        $this->grant = new NoEngineGrant();
    }

    /**
     * Whether an engine pass holds a frame or maintenance grant now.
     */
    public function isGranted(): bool
    {
        return ! $this->grant instanceof NoEngineGrant;
    }

    /**
     * Refuses an engine that acts without a frame or maintenance grant.
     *
     * @throws EngineAccessRefused
     */
    public function assertGranted(): void
    {
        if (! $this->isGranted()) {
            throw EngineAccessRefused::ungranted();
        }
    }

    /**
     * @throws EngineAccessRefused
     */
    public function assertTargetGranted(StackTarget $target): void
    {
        if (! $this->grant->allowsTarget($target)) {
            throw EngineAccessRefused::forTarget($target, $this->grant->description());
        }
    }

    /**
     * Passes when the grant covers the target, or the maintenance capability that may address any target.
     *
     * @throws EngineAccessRefused
     */
    public function assertTargetOrMaintenanceGranted(StackTarget $target, string $capability): void
    {
        if (! $this->grant->allowsTarget($target) && ! $this->allowsMaintenance($capability)) {
            throw EngineAccessRefused::forTarget($target, $this->grant->description());
        }
    }

    public function allowsMaintenance(string $capability): bool
    {
        return $this->grant instanceof EngineGrant && $this->grant->allowsMaintenance($capability);
    }

    /**
     * @throws EngineAccessRefused
     */
    public function assertMaintenanceGranted(string $capability): void
    {
        if (! $this->allowsMaintenance($capability)) {
            throw EngineAccessRefused::forMaintenance($capability, $this->grant->description());
        }
    }

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    private function withinGrant(EngineGrant|FrameGrant $grant, Closure $work): mixed
    {
        $before = $this->grant;
        $this->grant = $grant;

        try {
            return $work();
        } finally {
            $this->grant = $before;
        }
    }
}
