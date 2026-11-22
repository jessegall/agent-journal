<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\MessageSender;
use App\Enums\ActorType;

/**
 * The journal itself as an actor, system:1: a service principal with no row and no inbox, which may send but never
 * receives. Only trusted Core code acts as it, through ActorStore::actAsSystem.
 */
final readonly class SystemActor implements MessageSender
{
    public const string ID = '1';

    public function actorType(): ActorType
    {
        return ActorType::System;
    }

    public function actorId(): string
    {
        return self::ID;
    }
}
