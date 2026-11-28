<?php

declare(strict_types=1);

namespace App\Support;

use App\Actors\Contracts\Actor;
use App\Api\SignedCall;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionProcess;
use App\Sessions\Enums\TransportProfileType;
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
        public TransportProfileType $transport,
    ) {}

    /**
     * The context of a call signed for this started session, on the transport its latest start runs on.
     */
    public static function ofSession(AgentSession $session, SignedCall $call): self
    {
        $transport = SessionProcess::resolveTransportOfSession($session->id);

        return new self($session->agent_id, $session->id, $call, $session->last_heartbeat_at, $transport);
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
