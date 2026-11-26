<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Agents\Api\RetireAgentPayload;
use App\Agents\Commands\RetireAgent\RetireAgentCommand;
use App\Assignments\Data\AssignmentResultData;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Support\AssignmentHolders;

/**
 * Retires the named agent and answers the assignments it released.
 */
final readonly class RetireAgentController
{
    #[Dispatches(RetireAgentCommand::class)]
    public function __invoke(RetireAgentPayload $call, CommandBus $commands): AssignmentResultData
    {
        $retirement = $commands->run(new RetireAgentCommand(strtolower($call->agentId)));

        return AssignmentResultData::of($retirement, new AssignmentHolders([]));
    }
}
