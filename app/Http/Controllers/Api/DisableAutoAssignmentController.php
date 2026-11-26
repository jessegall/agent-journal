<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Assignments\Api\DisableAutoAssignmentPayload;
use App\Assignments\Commands\DisableAutoAssignment\DisableAutoAssignmentCommand;
use App\Assignments\Data\AutoAssignmentChangeData;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;

/**
 * Disables an auto-assignment and answers its revision.
 */
final readonly class DisableAutoAssignmentController
{
    #[Dispatches(DisableAutoAssignmentCommand::class)]
    public function __invoke(DisableAutoAssignmentPayload $call, CommandBus $commands): AutoAssignmentChangeData
    {
        $command = new DisableAutoAssignmentCommand($call->key(), $call->expectedRevision);

        return AutoAssignmentChangeData::of($commands->run($command));
    }
}
