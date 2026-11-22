<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actor;
use App\Contracts\ActorProvider;
use App\Exceptions\ActorUnavailable;
use App\Models\Agent;

/**
 * Agents as actors: an agent that exists and is not retired.
 */
final readonly class AgentActors implements ActorProvider
{
    public function actor(ActorIdentity $identity): Actor
    {
        return Agent::query()->whereKey(
            $identity->id,
        )->whereNull('retired_at')->firstOr(fn () => throw ActorUnavailable::forIdentity($identity));
    }
}
