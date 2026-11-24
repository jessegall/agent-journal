<?php

declare(strict_types=1);

namespace Domain\Chat\Contracts;

use App\Support\ActorIdentity;

/**
 * The pair chat of the current actor and another actor, such as the agent a user asks for feedback.
 */
interface PairChats
{
    /**
     * The inbox id of the pair chat of the current actor and the actor, opened the first time.
     */
    public function pairWith(ActorIdentity $actor): string;
}
