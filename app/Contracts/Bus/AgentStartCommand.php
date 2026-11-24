<?php

declare(strict_types=1);

namespace App\Contracts\Bus;

/**
 * A command that starts an agent, naming the agent it starts.
 */
interface AgentStartCommand
{
    /**
     * The id of the agent the command starts.
     */
    public function startedAgentId(): string;
}
