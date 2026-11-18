<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Agents\Support\StackTarget;

/**
 * Whether the engine, acting in this operation, was granted the stack it is about to change; the engine supplies it.
 */
interface EngineTargetAccess
{
    /**
     * Refuses a target the engine's current grant does not cover.
     */
    public function checkTarget(StackTarget $target): void;
}
