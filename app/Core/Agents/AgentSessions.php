<?php

declare(strict_types=1);

namespace App\Core\Agents;

use App\Core\Agents\Models\Agent;
use App\Core\Agents\Models\AgentSession;
use Carbon\CarbonImmutable;

/**
 * Starts and ends the journal sessions of agents; a child session names its parent.
 */
final readonly class AgentSessions
{
    public function start(Agent $agent, ?AgentSession $parent = null): AgentSession
    {
        $session = new AgentSession;
        $session->startFor($agent, $parent);

        return $session;
    }

    public function end(AgentSession $session): void
    {
        $session->endAt(CarbonImmutable::now());
    }
}
