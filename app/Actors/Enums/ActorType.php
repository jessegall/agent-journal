<?php

declare(strict_types=1);

namespace App\Actors\Enums;

/**
 * Who acts in a request or an operation: a started agent through its signed hook calls, a user through the browser,
 * the system, the journal's own service principal, which only trusted Core code can act as, or the engine inside its
 * own pass. Neither the system nor the engine is a user: no request or command line may name them.
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

    public function isAgent(): bool
    {
        return $this === self::Agent;
    }
}
