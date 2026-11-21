<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Agents\Values\StackTarget;
use App\Engine\Contracts\EngineGrant;

/**
 * The engine between frames and listeners: it may address nothing.
 */
final readonly class NoEngineGrant implements EngineGrant
{
    public function allowsTarget(StackTarget $target): bool
    {
        return false;
    }

    public function allowsMaintenance(string $capability): bool
    {
        return false;
    }

    public function description(): string
    {
        return 'no grant';
    }
}
