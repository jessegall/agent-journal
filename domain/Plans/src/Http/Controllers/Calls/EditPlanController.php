<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Calls;

use App\Contracts\Bus\CommandBus;
use Domain\Plans\Calls\EditPlanCall;
use Domain\Plans\Calls\PlanEdited;
use Domain\Plans\Commands\EditPlan\EditPlanCommand;

/**
 * Edits a plan and answers its revision.
 */
final readonly class EditPlanController
{
    public function __invoke(EditPlanCall $call, CommandBus $commands): PlanEdited
    {
        $command = new EditPlanCommand($call->planId, $call->expectedRevision, $call->title, $call->brief, $call->type);

        return PlanEdited::from(['planId' => $call->planId, 'revision' => $commands->run($command)]);
    }
}
