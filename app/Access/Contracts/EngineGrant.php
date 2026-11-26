<?php

declare(strict_types=1);

namespace App\Access\Contracts;

use App\Values\StackTarget;

/**
 * What the engine may address right now: the target of the frame it delivers to, or one declared maintenance scope.
 */
interface EngineGrant
{
    /**
     * Whether the grant covers work on the stack target.
     */
    public function allowsTarget(StackTarget $target): bool;

    /**
     * Whether the grant covers the maintenance capability.
     */
    public function allowsMaintenance(string $capability): bool;

    /**
     * The grant in words, for a refusal.
     */
    public function description(): string;
}
