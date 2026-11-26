<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Attributes\Dispatches;
use App\Bus\JournalCommands;
use App\Connections\Api\CancelProjectCommandPayload;
use App\Projects\Commands\CancelProjectCommandRun\CancelProjectCommandRunCommand;
use App\Support\AgentContext;
use App\Values\ApiAccepted;

/**
 * Cancels the calling agent's journal verb of this request key.
 */
final readonly class CancelProjectCommandController
{
    #[Dispatches(CancelProjectCommandRunCommand::class)]
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
