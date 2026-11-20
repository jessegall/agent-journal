<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Actors\Contracts\JournalAdmission;
use App\Actors\Exceptions\ConsoleOwnerMissing;
use App\Actors\Support\ActorIdentity;
use App\Supervision\Values\OwnerRoute;

final readonly class SupervisorOwner
{
    public function __construct(private JournalAdmission $admission) {}

    public function resolve(): OwnerRoute
    {
        try {
            return OwnerRoute::chainEnd(ActorIdentity::of($this->admission->owner()));
        } catch (ConsoleOwnerMissing) {
            return OwnerRoute::noOwner();
        }
    }
}
