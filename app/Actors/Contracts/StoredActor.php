<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

/**
 * A kind of actor whose references are kept in columns and facts as its type and an id. Its class names its type
 * once, and nothing else lists the kinds of actors.
 */
interface StoredActor extends Actor
{
    /**
     * The type a stored reference to an actor of this class holds, such as agent.
     */
    public static function storedType(): string;
}
