<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Actors\Contracts\ActorProvisioning;
use App\Actors\Support\ActorIdentity;
use App\Desks\Contracts\ActorDesks;

/**
 * Gives every newly admitted actor its personal desk.
 */
final readonly class PersonalDeskProvisioning implements ActorProvisioning
{
    public function __construct(private ActorDesks $desks) {}

    public function provision(ActorIdentity $actor, string $label): void
    {
        $this->desks->provision($actor, $label);
    }
}
