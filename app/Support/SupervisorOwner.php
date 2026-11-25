<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Admission\JournalAdmission;
use App\Exceptions\ConsoleOwnerMissing;
use App\Values\OwnerRoute;

final readonly class SupervisorOwner
{
    public function __construct(private JournalAdmission $admission) {}

    public function resolve(): OwnerRoute
    {
        try {
            return OwnerRoute::chainEnd(ActorReference::of($this->admission->owner()));
        } catch (ConsoleOwnerMissing) {
            return OwnerRoute::noOwner();
        }
    }
}
