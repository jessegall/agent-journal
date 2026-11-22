<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Enums\ActorType;

/**
 * The installation's engine as the actor of its own pass; it is set only inside an engine operation.
 */
final readonly class EngineActor implements Actor
{
    /**
     * The engine's one id, shaped as a ULID so it fits every column that stores an actor id.
     */
    public const string ID = '00000000000000000000000000';

    public function actorType(): ActorType
    {
        return ActorType::Engine;
    }

    public function actorId(): string
    {
        return self::ID;
    }
}
