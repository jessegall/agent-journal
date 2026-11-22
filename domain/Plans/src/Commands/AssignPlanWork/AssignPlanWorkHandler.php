<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\AssignPlanWork;

use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Support\AssignmentResult;
use Domain\Plans\Commands\Support\PlanCommandHandler;
use Domain\Plans\Support\PlanAssignmentGroup;

/**
 * Runs Core's cascade with the plan's group, collected under the plan's structure lock.
 */
final readonly class AssignPlanWorkHandler extends PlanCommandHandler
{
    public function __construct(
        private AssignmentWriter $writer,
        private PlanAssignmentGroup $groups,
    ) {}

    public function handle(AssignPlanWorkCommand $command): AssignmentResult
    {
        return $this->writer->assignUnfinished($command->recipient, fn () => $this->groups->for($command->root));
    }
}
