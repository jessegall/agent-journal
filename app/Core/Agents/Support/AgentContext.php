<?php

declare(strict_types=1);

namespace App\Core\Agents\Support;

use App\Core\Actors\Contracts\Actor;
use App\Core\Actors\Enums\ActorType;
use App\Core\AgentRequests\Support\SignedCall;
use App\Core\Agents\Models\AgentSession;

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

    /**
     * The context of a call signed for this launched session.
     */
    public static function ofSession(AgentSession $session, SignedCall $call): self
    {
        return new self($session->agent_id, $session->id, $session->agent->role, $call);
    }

    public function actorType(): ActorType
    {
        return ActorType::Agent;
    }

    public function actorId(): int
    {
        return $this->agentId;
    }
}
