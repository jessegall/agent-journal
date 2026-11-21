<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Agents\Support\AgentContext;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Connections\Commands\CancelProjectCommandRun;
use Illuminate\Http\Response;

/**
 * Cancels the calling agent's journal verb of this request id.
 */
final readonly class CancelProjectCommandController
{
    public function __invoke(string $requestId, AgentContext $agent, EntryDispatchers $dispatchers): Response
    {
        $cancel = new CancelProjectCommandRun($requestId, $agent->agentId);
        $dispatchers->runAsJournal(CommandEntry::HostControl, 'project command cancel', $cancel);

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
