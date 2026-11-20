<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Enums\AssignmentReason;
use App\Assignments\Support\AssignmentResult;

/**
 * Tells the journal what an assignment change did, so listeners receive it once the change commits.
 */
interface AssignmentFactPublisher
{
    public function publish(ActorIdentity $actor, AssignmentReason $reason, AssignmentResult $assignmentChange): void;
}
