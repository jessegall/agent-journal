<?php

declare(strict_types=1);

namespace Domain\Chat\Contracts;

use App\Support\ActorReference;

/**
 * The pair chat of the current actor and another actor, such as the agent a user asks for feedback.
 */
interface ChatDirectory
{
    /**
     * The inbox id of the pair chat of the current actor and the actor, opened the first time.
     */
    public function pairWith(ActorReference $actor): string;
}
