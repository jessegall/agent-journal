<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Support\ActorLabelSet;
use App\Support\ActorReference;

/**
 * The display names of any actors, read with one query per actor type, through the provider each type's owner
 * registered; it never asks what type an actor is.
 */
interface ActorLabels
{
    /**
     * @param  list<ActorReference>  $actors
     */
    public function labelsFor(array $actors): ActorLabelSet;
}
