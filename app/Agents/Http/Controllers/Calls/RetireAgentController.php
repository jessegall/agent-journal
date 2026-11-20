<?php

declare(strict_types=1);

namespace App\Agents\Http\Controllers\Calls;

use App\Agents\Calls\RetireAgentCall;
use App\Agents\Commands\RetireAgent;
use App\Assignments\Support\AssignmentHolders;
use App\Bus\Contracts\CommandBus;
use App\Http\Data\Assignments\AssignmentResultData;

/**
 * Retires the named agent and answers the assignments it released.
 */
final readonly class RetireAgentController
{
    public function __invoke(RetireAgentCall $call, CommandBus $commands): AssignmentResultData
    {
        $retirement = $commands->run(new RetireAgent(strtolower($call->agentId)));

        return AssignmentResultData::of($retirement, new AssignmentHolders([]));
    }
}
