<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\StackTarget;

/**
 * What the engine may address right now: the target of the frame it delivers to, or one declared maintenance scope.
 */
interface EngineGrant
{
    public function allowsTarget(StackTarget $target): bool;

    public function allowsMaintenance(string $capability): bool;

    /**
     * The grant in words, for a refusal.
     */
    public function description(): string;
}
