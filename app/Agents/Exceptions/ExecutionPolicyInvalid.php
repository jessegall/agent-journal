<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\AgentRole;
use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * An execution policy that breaks its role's requirement or names no image for its container.
 */
final class ExecutionPolicyInvalid extends InvalidArgumentException implements CommandRefusal
{
    public static function containerRequired(AgentRole $role): self
    {
        return new self("A {$role->name} always runs in a required container; it never runs on the host.");
    }

    public static function imageMissing(): self
    {
        return new self('A required container names its verified image.');
    }
}
