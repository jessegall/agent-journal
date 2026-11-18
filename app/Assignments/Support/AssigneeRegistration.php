<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Actors\Enums\ActorType;
use App\Assignments\Contracts\AssigneeProvider;
use App\Assignments\Contracts\AutoAssignmentActivity;

/**
 * Which provider answers for one type of actor that can hold records, and which says whether such an actor may take
 * work automatically now: Access for users, Core for agents.
 */
final readonly class AssigneeRegistration
{
    /**
     * @param  class-string<AssigneeProvider>  $providerClass
     * @param  class-string<AutoAssignmentActivity>  $activityClass
     */
    public function __construct(
        public ActorType $type,
        public string $providerClass,
        public string $activityClass,
    ) {}
}
