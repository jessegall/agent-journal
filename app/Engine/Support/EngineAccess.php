<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Agents\Support\StackTarget;
use App\Engine\Contracts\EngineGrant;
use App\Engine\Exceptions\EngineAccessRefused;

/**
 * What the engine may address in this operation, one grant at a time: a frame's target or a listener's declared
 * maintenance capability. It starts with no grant, so everything is refused until the engine grants something.
 */
final class EngineAccess
{
    private EngineGrant $grant;

    public function __construct()
    {
        $this->grant = new NoEngineGrant;
    }

    public function grantFrame(StackTarget $target, string $frameId): void
    {
        $this->grant = new FrameGrant($target, $frameId);
    }

    public function grantMaintenance(string $capability): void
    {
        $this->grant = new MaintenanceGrant($capability);
    }

    public function clear(): void
    {
        $this->grant = new NoEngineGrant;
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
     * @throws EngineAccessRefused
     */
    public function checkMaintenance(string $capability): void
    {
        if (! $this->grant->allowsMaintenance($capability)) {
            throw EngineAccessRefused::forMaintenance($capability, $this->grant->description());
        }
    }
}
