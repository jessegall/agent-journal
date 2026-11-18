<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

final class AgentRetirementDenied extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function forCaller(ActorIdentity $caller, string $agentId): self
    {
        return new self("The {$caller->type->value} {$caller->id} may not retire agent {$agentId}; only the owner, or a main agent retiring an agent that is not a main agent, may.");
    }

    protected function status(): int
    {
        return 403;
    }
}
