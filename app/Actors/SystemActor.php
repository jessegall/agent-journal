<?php

declare(strict_types=1);

namespace App\Actors;

use App\Actors\Contracts\StoredActor;

/**
 * The journal itself as an actor, with no row or inbox. It acts through a trusted entry or during an engine pass.
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
