<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Shows a command request: its state, the steps it still requires, the next allowed command, its proposals and readers.
 */
#[JournalRoute(JournalRouteType::Read)]
final class CommandTypeShowCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'command-type:show {request : The command request id} {--json}';

    protected $description = 'Show a command request and its next step';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, "/agent/processes/requests/{$this->argument('request')}/show", []);
    }
}
