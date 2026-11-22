<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Enums\AssignmentReason;
use App\Support\ActorIdentity;
use App\Support\AssignmentResult;

/**
 * Tells the journal what an assignment change did, so listeners receive it once the change commits.
 */
interface AssignmentFactPublisher
{
    public function publish(ActorIdentity $actor, AssignmentReason $reason, AssignmentResult $assignmentChange): void;
}
