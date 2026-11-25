<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Connections\CancelProjectCommandPayload;
use App\Commands\Projects\CancelProjectCommandRun\CancelProjectCommandRunCommand;
use App\Enums\Accounts\CommandEntry;
use App\Support\AgentContext;
use App\Support\JournalCommands;
use App\Values\ApiAccepted;

/**
 * Cancels the calling agent's journal verb of this request key.
 */
final readonly class CancelProjectCommandController
{
    public function __invoke(
        CancelProjectCommandPayload $call,
        AgentContext $agent,
        JournalCommands $dispatchers,
    ): ApiAccepted {
        $cancelRun = new CancelProjectCommandRunCommand($call->requestKey, $agent->agentId);
        $dispatchers->runAsJournal(CommandEntry::HostControl, 'project command cancel', $cancelRun);

        return new ApiAccepted();
    }
}
