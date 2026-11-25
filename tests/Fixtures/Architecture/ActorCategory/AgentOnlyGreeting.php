<?php

declare(strict_types=1);

namespace Tests\Fixtures\Architecture\ActorCategory;

use App\Models\Agents\Agent;
use App\Support\ActorReference;

/**
 * Chooses behaviour by the kind of actor, which is forbidden; the actor category test must find it.
 */
final readonly class AgentOnlyGreeting
{
    public function greet(ActorReference $actor): string
    {
        if ($actor->type === Agent::storedType()) {
            return 'Hello, agent.';
        }

        return 'Hello.';
    }
}
