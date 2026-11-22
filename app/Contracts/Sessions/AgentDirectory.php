<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

use App\Exceptions\StackTargetRefused;
use App\Support\AgentOption;
use PhpOption\Option;

/**
 * The agents whoever acts in this request may see, idle ones included: every one for the user, only itself for an
 * agent; and which of them is the installation's main agent.
 */
interface AgentDirectory
{
    /**
     * @return list<AgentOption>
     */
    public function visible(): array;

    /**
     * One agent the actor may see, refused like a missing one when it is out of sight.
     *
     * @throws StackTargetRefused
     */
    public function visibleAgent(string $agentId): AgentOption;

    /**
     * The designated main agent's id; none before agents:install ran.
     *
     * @return Option<string>
     */
    public function mainAgentId(): Option;
}
