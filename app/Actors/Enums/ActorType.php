<?php

declare(strict_types=1);

namespace App\Actors\Enums;

/**
 * Who acts in a request or an operation: a launched agent through its signed hook calls, a user through the browser,
 * or the engine inside its own pass. The engine is no person: it never holds work, signs in or counts as present, and
 * no request or command line may name it.
 */
enum ActorType: string
{
    case Agent = 'agent';
    case User = 'user';
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
}
