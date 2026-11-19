<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Agents\Actions\LaunchSessions;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use Tests\Fixtures\Agents\TestSelections;

/**
 * Launches a named main agent on Claude Code, as the host does for a launch the owner asked for.
 */
trait LaunchesMainAgents
{
    private function launchedMainAgentSession(string $name = 'Builder'): AgentSession
    {
        $agent = Agent::named($name, 'main-agent');

        return $this->app->make(LaunchSessions::class)
            ->launch($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
    }

    /**
     * @return array{string, string} the agent id and its session id
     */
    private function launchMainAgent(string $name): array
    {
        $session = $this->launchedMainAgentSession($name);

        return [$session->agent_id, $session->id];
    }
}
