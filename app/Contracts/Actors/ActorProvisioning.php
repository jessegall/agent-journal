<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Support\ActorIdentity;

/**
 * What every newly admitted actor is given, such as its own desk, in the transaction that admits it.
 */
interface ActorProvisioning
{
    /**
     * Gives a new actor what it needs to take part, under the label users see.
     */
    public function provision(ActorIdentity $actor, string $label): void;
}
