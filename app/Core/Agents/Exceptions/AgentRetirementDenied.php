<?php

declare(strict_types=1);

namespace App\Core\Agents\Exceptions;

use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Exceptions\Concerns\RendersRefusal;
use RuntimeException;

final class AgentRetirementDenied extends RuntimeException
{
    use RendersRefusal;

    public static function forCaller(ActorIdentity $caller, int $agentId): self
    {
        return new self("The {$caller->kind->value} {$caller->id} may not retire agent {$agentId}; only the owner, or a main agent retiring an agent that is not a main agent, may.");
    }

    public static function insideTransaction(): self
    {
        return new self('An agent is retired in a transaction of its own, so it sees every session and assignment committed before it.');
    }

    protected function status(): int
    {
        return 403;
    }
}
