<?php

declare(strict_types=1);

namespace Domain\Plans\Actions;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Assignments\Support\RecordIdentity;
use Domain\Plans\Contracts\PlanAssignments;
use Domain\Plans\Support\PlanAssignmentGroup;

/**
 * The plan and phase cascades: Core's writer runs each in one transaction and calls back for the group, which Plans
 * collects under the plan's structure lock.
 */
final readonly class ChangePlanAssignments implements PlanAssignments
{
    public function __construct(
        private AssignmentWriter $writer,
        private PlanAssignmentGroup $groups,
    ) {}

    public function assign(RecordIdentity $root, ActorIdentity $recipient): AssignmentResult
    {
        return $this->writer->assignUnfinished($recipient, fn () => $this->groups->for($root));
    }

    public function reassign(RecordIdentity $root, AssignmentReference $expectedRoot, ActorIdentity $recipient): AssignmentResult
    {
        return $this->writer->reassignUnfinished($expectedRoot, $recipient, fn () => $this->groups->for($root));
    }

    public function unassign(RecordIdentity $root, AssignmentReference $expectedRoot): AssignmentResult
    {
        return $this->writer->unassignUnfinished($expectedRoot, fn () => $this->groups->for($root));
    }
}
