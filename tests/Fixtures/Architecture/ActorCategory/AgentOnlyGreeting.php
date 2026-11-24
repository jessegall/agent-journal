<?php

declare(strict_types=1);

namespace Tests\Fixtures\Architecture\ActorCategory;

use App\Enums\ActorType;
use App\Support\ActorIdentity;

/**
 * Chooses behaviour by the kind of actor, which is forbidden; the actor category test must find it.
 */
final readonly class AgentOnlyGreeting
{
    public function greet(ActorIdentity $actor): string
    {
        if ($actor->type === ActorType::Agent) {
            return 'Hello, agent.';
        }

        return 'Hello.';
    }
}
