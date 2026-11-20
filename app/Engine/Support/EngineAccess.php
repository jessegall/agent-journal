<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Agents\Support\StackTarget;
use App\Engine\Contracts\EngineGrant;
use App\Engine\Exceptions\EngineAccessRefused;
use App\Hooks\Contracts\EngineTargetAccess;

/**
 * What the engine may address in this operation, one grant at a time: a frame's target or a listener's declared
 * maintenance capability. It starts with no grant, so everything is refused until the engine grants something.
 */
final class EngineAccess implements EngineTargetAccess
{
    private EngineGrant $grant;

    public function __construct()
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

    public function frameTargets(): array
    {
        return $this->grant instanceof FrameGrant ? [$this->grant->target] : [];
    }

    public function clear(): void
    {
        $this->grant = new NoEngineGrant();
    }

    /**
     * Refuses an engine that acts without a frame or maintenance grant.
     *
     * @throws EngineAccessRefused
     */
    public function requireGranted(): void
    {
        if ($this->grant instanceof NoEngineGrant) {
            throw EngineAccessRefused::ungranted();
        }
    }

    /**
     * @throws EngineAccessRefused
     */
    public function checkTarget(StackTarget $target): void
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
    public function checkTargetOrMaintenance(StackTarget $target, string $capability): void
    {
        if (! $this->grant->allowsTarget($target) && ! $this->grant->allowsMaintenance($capability)) {
            throw EngineAccessRefused::forTarget($target, $this->grant->description());
        }
    }

    public function allowsMaintenance(string $capability): bool
    {
        return $this->grant->allowsMaintenance($capability);
    }

    /**
     * @throws EngineAccessRefused
     */
    public function checkMaintenance(string $capability): void
    {
        if (! $this->allowsMaintenance($capability)) {
            throw EngineAccessRefused::forMaintenance($capability, $this->grant->description());
        }
    }
}
