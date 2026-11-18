<?php

declare(strict_types=1);

namespace App\Actors\Enums;

use App\Actors\Exceptions\AgentActorRequired;
use App\Actors\Exceptions\EngineActorRequired;
use App\Actors\Exceptions\SystemActorRequired;
use App\Actors\Exceptions\UserActorRequired;

/**
 * Who acts in a request or an operation: a launched agent through its signed hook calls, a user through the browser,
 * the system, the journal's own service principal, which only trusted Core code can act as, or the engine inside its
 * own pass. Neither the system nor the engine is a person: no request or command line may name them.
 */
enum ActorType: string
{
    case Agent = 'agent';
    case User = 'user';
    case System = 'system';
    case Engine = 'engine';

    /**
     * The types a request or a command line may name, such as a recipient of work.
     *
     * @return list<self>
     */
    public static function requestTypes(): array
    {
        return [self::Agent, self::User];
    }

    /**
     * Whether an actor of this type signed in, as a user or an agent, and so may read ordinary content; the system
     * and the engine read only through named queries.
     */
    public function isSignedIn(): bool
    {
        return match ($this) {
            self::User, self::Agent => true,
            self::System, self::Engine => false,
        };
    }

    /**
     * The refusal for a command that requires this type of actor but was run by another.
     */
    public function refusalFor(self $given): UserActorRequired|AgentActorRequired|SystemActorRequired|EngineActorRequired
    {
        return match ($this) {
            self::User => UserActorRequired::forActor($given->value),
            self::Agent => AgentActorRequired::forActor($given->value),
            self::System => SystemActorRequired::forActor($given->value),
            self::Engine => EngineActorRequired::forActor($given->value),
        };
    }
}
