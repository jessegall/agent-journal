<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Authorization\EngineGrant;
use App\Values\StackTarget;

/**
 * The engine running a periodic listener: its commands may use the one maintenance capability the listener declared.
 */
final readonly class MaintenanceGrant implements EngineGrant
{
    public function __construct(public string $capability) {}

    public function allowsTarget(StackTarget $target): bool
    {
        return false;
    }

    public function allowsMaintenance(string $capability): bool
    {
        return $capability === $this->capability;
    }

    public function description(): string
    {
        return "maintenance {$this->capability}";
    }
}
