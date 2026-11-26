<?php

declare(strict_types=1);

namespace App\Assignments;

use App\Assignments\Contracts\AutoAssignmentActivity;

/**
 * Which activity says whether an actor of one type may take automatically assigned work now.
 */
final readonly class ActivityDefinition
{
    /**
     * @param  string  $activityClass  a class name, refused unless it is an AutoAssignmentActivity
     */
    public function __construct(
        public string $type,
        public string $activityClass,
    ) {}
}
