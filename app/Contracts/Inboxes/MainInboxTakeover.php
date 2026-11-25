<?php

declare(strict_types=1);

namespace App\Contracts\Inboxes;

use App\Models\Agents\Agent;

/**
 * Attaches the agent a main start opened to main, fencing a different agent that was attached there.
 */
interface MainInboxTakeover
{
    /**
     * Attaches the agent to main, fencing whichever other agent was attached.
     */
    public function takeOver(Agent $agent): void;
}
