<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\ActorIdentity;

/**
 * What every newly admitted actor is given, such as its own desk, in the transaction that admits it.
 */
interface ActorProvisioning
{
    public function provision(ActorIdentity $actor, string $label): void;
}
