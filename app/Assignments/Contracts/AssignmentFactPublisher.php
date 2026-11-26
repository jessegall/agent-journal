<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\Enums\AssignmentReason;
use App\Support\ActorReference;
use App\Support\AssignmentResult;

/**
 * Tells the journal what an assignment change did, so listeners receive it once the change commits.
 */
interface AssignmentFactPublisher
{
    /**
     * Tells the rest of the journal about an assignment change the actor made, for the reason given.
     */
    public function publish(ActorReference $actor, AssignmentReason $reason, AssignmentResult $assignmentChange): void;
}
