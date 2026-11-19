<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

/**
 * What the owner of one actor type answers for labels: the display names of its actors, read in one query.
 */
interface ActorLabelProvider
{
    /**
     * The name of each actor the current actor may see, keyed by actor id; an actor it may not see is left out.
     *
     * @param  list<string>  $actorIds
     * @return array<string, string>
     */
    public function namesOf(array $actorIds): array;
}
