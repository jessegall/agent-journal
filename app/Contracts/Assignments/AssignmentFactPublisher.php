<?php

declare(strict_types=1);

namespace App\Contracts\Assignments;

use App\Enums\Assignments\AssignmentReason;
use App\Support\ActorIdentity;
use App\Support\AssignmentResult;

/**
 * Tells the journal what an assignment change did, so listeners receive it once the change commits.
 */
interface AssignmentFactPublisher
{
    /**
     * Tells the rest of the journal about an assignment change the actor made, for the reason given.
     */
    public function publish(ActorIdentity $actor, AssignmentReason $reason, AssignmentResult $assignmentChange): void;
}
