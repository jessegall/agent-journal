<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\ActorProvider;
use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Support\ActorIdentity;
use App\Agents\Models\Agent;

/**
 * Agents as actors: an agent that exists and is not retired.
 */
final readonly class AgentActors implements ActorProvider
{
    public function actor(ActorIdentity $identity): Actor
    {
        return Agent::query()->whereKey($identity->id)->whereNull('retired_at')->first() ?? throw ActorUnavailable::forIdentity($identity);
    }
}
