<?php

declare(strict_types=1);

namespace Tests\Support\Assertions\Facts;

use App\Models\Agents\AgentSession;
use Tests\Support\Assertions\Contracts\Facts;

/**
 * An agent's session as a test asserts it: its status, its last heartbeat and since when it is silent.
 */
final readonly class SessionFacts implements Facts
{
    public function __construct(private string $sessionId) {}

    public function facts(): array
    {
        $session = AgentSession::query()->withoutGlobalScopes()->whereKey($this->sessionId)->sole();

        return [
            'status' => $session->status,
            'lastHeartbeat' => $session->last_heartbeat_at,
            'silentSince' => $session->silent_since,
            'endedAt' => $session->ended_at,
        ];
    }
}
