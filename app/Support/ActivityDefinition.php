<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\AutoAssignmentActivity;
use App\Enums\ActorType;

/**
 * Which activity says whether an actor of one type may take automatically assigned work now.
 */
final readonly class ActivityDefinition
{
    /**
     * @param  string  $activityClass  a class name, refused unless it is an AutoAssignmentActivity
     */
    public function __construct(
        public ActorType $type,
        public string $activityClass,
    ) {}
}
