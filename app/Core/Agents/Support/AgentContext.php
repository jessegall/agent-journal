<?php

declare(strict_types=1);

namespace App\Core\Agents\Support;

use App\Core\Actors\Enums\ActorKind;
use App\Core\Contracts\Actor;

/**
 * Who is calling in this request: the agent, its journal session and role, and the signed call. It lives for one request only.
 */
final readonly class AgentContext implements Actor
{
    public function __construct(
        public int $agentId,
        public int $sessionId,
        public string $role,
        public SignedCall $call,
    ) {}

    public function actorKind(): ActorKind
    {
        return ActorKind::Agent;
    }

    public function actorId(): int
    {
        return $this->agentId;
    }
}
