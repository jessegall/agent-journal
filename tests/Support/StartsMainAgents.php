<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Agents\Actions\StartSessions;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use Tests\Fixtures\Agents\TestSelections;

/**
 * Starts a named main agent on Claude Code, as the host does for a start the owner asked for.
 */
trait StartsMainAgents
{
    private function startedMainAgentSession(string $name = 'Builder'): AgentSession
    {
        $agent = Agent::named($name, 'main-agent');

        return $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
    }

    /**
     * @return array{string, string} the agent id and its session id
     */
    private function startMainAgent(string $name): array
    {
        $session = $this->startedMainAgentSession($name);

        return [$session->agent_id, $session->id];
    }
}
