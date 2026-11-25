<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Actors\ActorProvider;
use App\Exceptions\ActorUnavailable;
use App\Models\Agents\Agent;

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
