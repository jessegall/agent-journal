<?php

declare(strict_types=1);

namespace App\Agents;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\ActorProvider;
use App\Exceptions\ActorUnavailable;
use App\Models\Agents\Agent;
use App\Support\ActorReference;

/**
 * Agents as actors: an agent that exists and is not retired.
 */
final readonly class AgentActors implements ActorProvider
{
    public function actor(ActorReference $identity): Actor
    {
        return Agent::query()->whereKey(
            $identity->id,
        )->unretired()->firstOr(ActorUnavailable::throwing()->forIdentity($identity));
    }
}
