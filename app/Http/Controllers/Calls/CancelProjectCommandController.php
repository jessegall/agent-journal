<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Connections\CancelProjectCommandCall;
use App\Commands\Projects\CancelProjectCommandRun\CancelProjectCommandRunCommand;
use App\Enums\Accounts\CommandEntry;
use App\Support\AgentContext;
use App\Support\JournalCommands;
use App\Values\CallAccepted;

/**
 * Cancels the calling agent's journal verb of this request key.
 */
final readonly class CancelProjectCommandController
{
    public function __invoke(
        CancelProjectCommandCall $call,
        AgentContext $agent,
        JournalCommands $dispatchers,
    ): CallAccepted {
        $cancelRun = new CancelProjectCommandRunCommand($call->requestKey, $agent->agentId);
        $dispatchers->runAsJournal(CommandEntry::HostControl, 'project command cancel', $cancelRun);

        return new CallAccepted();
    }
}
