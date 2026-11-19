<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Models\Agent;

/**
 * Gives the agent a main start opened main's seat, fencing a different agent that held it.
 */
interface MainSeatTakeover
{
    public function takeOver(Agent $agent): void;
}
