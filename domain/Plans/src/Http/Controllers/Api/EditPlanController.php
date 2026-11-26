<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Api;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use Domain\Plans\Api\EditPlanPayload;
use Domain\Plans\Api\PlanEdited;
use Domain\Plans\Commands\EditPlan\EditPlanCommand;

/**
 * Edits a plan and answers its revision.
 */
final readonly class EditPlanController
{
    #[Dispatches(EditPlanCommand::class)]
    public function __invoke(EditPlanPayload $call, CommandBus $commands): PlanEdited
    {
        $command = new EditPlanCommand($call->planId, $call->expectedRevision, $call->title, $call->brief, $call->type);

        return PlanEdited::from(['planId' => $call->planId, 'revision' => $commands->run($command)]);
    }
}
