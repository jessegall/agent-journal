<?php

declare(strict_types=1);

namespace App\Contracts\Agents;

/**
 * Tells an agent something from the journal itself, straight into its running session: the journal sends no
 * messages. An agent with no session running is told nothing.
 */
interface AgentNotices
{
    /**
     * Delivers the text to the agent's running session under the key, which tells one delivery from another.
     */
    public function notify(string $agentId, string $text, string $key): void;
}
