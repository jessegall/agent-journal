<?php

declare(strict_types=1);

namespace App\Actors\Enums;

use App\Actors\Exceptions\AgentActorRequired;
use App\Actors\Exceptions\SystemActorRequired;
use App\Actors\Exceptions\UserActorRequired;

/**
 * Who acts in a request: a launched agent through its signed hook calls, a user through the browser, or the system,
 * the journal's own service principal, which only trusted Core code can act as.
 */
enum ActorType: string
{
    case Agent = 'agent';
    case User = 'user';
    case System = 'system';

    /**
     * The refusal for a command that requires this type of actor but was run by another.
     */
    public function refusalFor(self $given): UserActorRequired|AgentActorRequired|SystemActorRequired
    {
        return match ($this) {
            self::User => UserActorRequired::forActor($given->value),
            self::Agent => AgentActorRequired::forActor($given->value),
            self::System => SystemActorRequired::forActor($given->value),
        };
    }
}
