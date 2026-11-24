<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Support\ActorIdentity;
use App\Values\AgentText;

/**
 * Hands an actor guidance it reads at its next hook, and wakes it to read it.
 */
interface ActorGuidance
{
    /**
     * @param  string  $key  what the guidance is for, so one wake stands for it
     */
    public function retain(ActorIdentity $actor, AgentText $guidance, string $key): void;
}
