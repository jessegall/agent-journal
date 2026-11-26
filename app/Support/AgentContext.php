<?php

declare(strict_types=1);

namespace App\Support;

use App\Actors\Contracts\Actor;
use App\Api\SignedCall;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use Carbon\CarbonImmutable;

/**
 * Who is calling in this request: the agent, its journal session, the signed call and the session's last beat. It lives
 * for one request only.
 */
final readonly class AgentContext implements Actor
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public SignedCall $call,
        public CarbonImmutable|null $lastHeartbeatAt,
    ) {}

    /**
     * The context of a call signed for this started session.
     */
    public static function ofSession(AgentSession $session, SignedCall $call): self
    {
        return new self($session->agent_id, $session->id, $call, $session->last_heartbeat_at);
    }

    /**
     * Whether the session's stored beat, read when the call was authenticated, is missing or older than the cutoff.
     */
    public function isHeartbeatOlderThan(CarbonImmutable $cutoff): bool
    {
        return $this->lastHeartbeatAt === null || $this->lastHeartbeatAt->lessThan($cutoff);
    }

    public function actorType(): string
    {
        return Agent::storedType();
    }

    public function actorId(): string
    {
        return $this->agentId;
    }
}
