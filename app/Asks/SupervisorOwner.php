<?php

declare(strict_types=1);

namespace App\Asks;

use App\Access\Contracts\JournalAdmission;
use App\Asks\Values\OwnerRoute;
use App\Exceptions\ConsoleOwnerMissing;

final readonly class SupervisorOwner
{
    public function __construct(private JournalAdmission $admission) {}

    public function resolve(): OwnerRoute
    {
        try {
            return OwnerRoute::chainEnd($this->admission->owner());
        } catch (ConsoleOwnerMissing) {
            return OwnerRoute::noOwner();
        }
    }
}
