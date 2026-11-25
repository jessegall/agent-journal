<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Assignments\DisableAutoAssignmentPayload;
use App\Commands\Assignments\DisableAutoAssignment\DisableAutoAssignmentCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Assignments\AutoAssignmentChangeData;

/**
 * Disables an auto-assignment and answers its revision.
 */
final readonly class DisableAutoAssignmentController
{
    public function __invoke(DisableAutoAssignmentPayload $call, CommandBus $commands): AutoAssignmentChangeData
    {
        $command = new DisableAutoAssignmentCommand($call->key(), $call->expectedRevision);

        return AutoAssignmentChangeData::of($commands->run($command));
    }
}
