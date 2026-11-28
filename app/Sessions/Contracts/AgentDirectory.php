<?php

declare(strict_types=1);

namespace App\Sessions\Contracts;

use App\Exceptions\StackTargetRefused;
use App\Support\HomeAgent;
use PhpOption\Option;

/**
 * The agents whoever acts in this request may see, idle ones included: every one for the user, only itself for an
 * agent; and which of them is the installation's main agent.
 */
interface AgentDirectory
{
    /**
     * @return list<HomeAgent>
     */
    public function visible(): array;

    /**
     * The agents among those ids the actor may see, in the order of the ids; one out of sight is left out.
     *
     * @param  list<string>  $ids
     * @return list<HomeAgent>
     */
    public function visibleAmong(array $ids): array;

    /**
     * One agent the actor may see, refused like a missing one when it is out of sight.
     *
     * @throws StackTargetRefused
     */
    public function visibleAgent(string $agentId): HomeAgent;

    /**
     * The designated main agent's id; none before agents:install ran.
     *
     * @return Option<string>
     */
    public function mainAgentId(): Option;
}
