<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\ActorIdentity;
use App\Support\ActorLabelSet;

/**
 * The display names of any actors, read with one query per actor type, through the provider each type's owner
 * registered; it never asks what type an actor is.
 */
interface ActorLabels
{
    /**
     * @param  list<ActorIdentity>  $actors
     */
    public function labelsFor(array $actors): ActorLabelSet;
}
