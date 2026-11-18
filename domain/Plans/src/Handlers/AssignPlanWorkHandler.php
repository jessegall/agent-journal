<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Support\AssignmentResult;
use App\Contracts\CommandHandler;
use Domain\Plans\Commands\AssignPlanWork;
use Domain\Plans\Support\PlanAssignmentGroup;

/**
 * Runs Core's cascade with the plan's group, collected under the plan's structure lock.
 */
final readonly class AssignPlanWorkHandler implements CommandHandler
{
    public function __construct(
        private AssignmentWriter $writer,
        private PlanAssignmentGroup $groups,
    ) {}

    public function handle(AssignPlanWork $command): AssignmentResult
    {
        return $this->writer->assignUnfinished($command->recipient, fn () => $this->groups->for($command->root));
    }
}
