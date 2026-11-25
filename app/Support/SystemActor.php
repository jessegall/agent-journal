<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\StoredActor;

/**
 * The journal itself as an actor: a service principal with no row and no inbox, which sends no messages. Trusted
 * Core code acts as it, in an engine pass or through ActorStore::actAsSystem.
 */
final readonly class SystemActor implements StoredActor
{
    /**
     * The journal's one id, shaped as a ULID so it fits every column that stores an actor id.
     */
    public const string ID = '00000000000000000000000000';

    public static function storedType(): string
    {
        return 'system';
    }

    public function actorType(): string
    {
        return self::storedType();
    }

    public function actorId(): string
    {
        return self::ID;
    }
}
