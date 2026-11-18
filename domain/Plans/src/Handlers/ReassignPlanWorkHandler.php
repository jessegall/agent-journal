<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Support\AssignmentResult;
use App\Contracts\CommandHandler;
use Domain\Plans\Commands\ReassignPlanWork;
use Domain\Plans\Support\PlanAssignmentGroup;

/**
 * Runs Core's reassigning cascade with the plan's group; a stale expected holder is refused by the writer.
 */
final readonly class ReassignPlanWorkHandler implements CommandHandler
{
    public function __construct(
        private AssignmentWriter $writer,
        private PlanAssignmentGroup $groups,
    ) {}

    public function handle(ReassignPlanWork $command): AssignmentResult
    {
        return $this->writer->reassignUnfinished($command->expectedRoot, $command->recipient, fn () => $this->groups->for($command->root));
    }
}
