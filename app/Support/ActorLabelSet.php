<?php

declare(strict_types=1);

namespace App\Support;

/**
 * The display names read for a batch of actors, by actor type and id.
 */
final readonly class ActorLabelSet
{
    /**
     * @param  array<string, array<string, string>>  $namesByType  the names of each actor type, keyed by actor id
     */
    public function __construct(public array $namesByType) {}

    /**
     * The actor's name, or null when the actor was not read or the current actor may not see it.
     */
    public function nameOf(ActorIdentity $actor): string|null
    {
        return $this->namesByType[$actor->type][$actor->id] ?? null;
    }
}
