<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Models\Agents\Agent;

/**
 * Gives the agent a main start opened main's seat, fencing a different agent that held it.
 */
interface MainSeatTakeover
{
    /**
     * Seats the agent at main in place of the agent there now, which loses the seat.
     */
    public function takeOver(Agent $agent): void;
}
