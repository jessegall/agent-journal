<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Exceptions\TerminalViewRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;

/**
 * The runtime an agent's terminal belongs to now, for watching and for control alike.
 */
final readonly class CurrentRuntimes
{
    /**
     * The agent's current runtime; an unknown agent and an agent with no runtime get the answer of no permission.
     *
     * @throws TerminalViewRefused
     */
    public function of(string $agentId): AgentRuntime
    {
        $agent = Agent::query()->find($agentId);

        if ($agent === null || $agent->currentRuntime()->isEmpty()) {
            throw TerminalViewRefused::mayNotInspect();
        }

        $sessionId = $agent->currentRuntime()->get()->target->sessionId;

        return AgentRuntime::ofSession($sessionId) ?? throw TerminalViewRefused::mayNotInspect();
    }
}
