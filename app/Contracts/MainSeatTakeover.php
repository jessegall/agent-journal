<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Models\Agent;

/**
 * Gives the agent a main start opened main's seat, fencing a different agent that held it.
 */
interface MainSeatTakeover
{
    public function takeOver(Agent $agent): void;
}
