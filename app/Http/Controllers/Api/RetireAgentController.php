<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Agents\RetireAgentPayload;
use App\Commands\Agents\RetireAgent\RetireAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Assignments\AssignmentResultData;
use App\Support\AssignmentHolders;

/**
 * Retires the named agent and answers the assignments it released.
 */
final readonly class RetireAgentController
{
    public function __invoke(RetireAgentPayload $call, CommandBus $commands): AssignmentResultData
    {
        $retirement = $commands->run(new RetireAgentCommand(strtolower($call->agentId)));

        return AssignmentResultData::of($retirement, new AssignmentHolders([]));
    }
}
