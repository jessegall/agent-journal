<?php

declare(strict_types=1);

namespace Domain\Plans\Commands\ReassignPlanWork;

use App\Assignments\Contracts\AssignmentWriter;
use App\Support\AssignmentResult;
use Domain\Plans\Commands\Support\PlanCommandHandler;
use Domain\Plans\Support\PlanAssignmentGroup;

/**
 * Runs Core's reassigning cascade with the plan's group; a stale expected holder is refused by the writer.
 */
final readonly class ReassignPlanWorkHandler extends PlanCommandHandler
{
    public function __construct(
        private AssignmentWriter $writer,
        private PlanAssignmentGroup $groups,
    ) {}

    public function handle(ReassignPlanWorkCommand $command): AssignmentResult
    {
        return $this->writer->reassignUnfinished(
            $command->expectedRoot,
            $command->recipient,
            fn () => $this->groups->for($command->root),
        );
    }
}
