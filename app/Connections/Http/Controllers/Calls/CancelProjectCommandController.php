<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers\Calls;

use App\AgentRequests\Values\CallAccepted;
use App\Agents\Support\AgentContext;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Connections\Calls\CancelProjectCommandCall;
use App\Connections\Commands\CancelProjectCommandRun;

/**
 * Cancels the calling agent's journal verb of this request key.
 */
final readonly class CancelProjectCommandController
{
    public function __invoke(
        CancelProjectCommandCall $call,
        AgentContext $agent,
        EntryDispatchers $dispatchers,
    ): CallAccepted {
        $cancelRun = new CancelProjectCommandRun($call->requestKey, $agent->agentId);
        $dispatchers->runAsJournal(CommandEntry::HostControl, 'project command cancel', $cancelRun);

        return new CallAccepted();
    }
}
