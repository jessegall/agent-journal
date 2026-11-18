<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Shows a run's parts with their lifecycle, own exits and capture state.
 */
#[JournalRoute(JournalRouteType::Read)]
final class ProcessShowCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'process:show {run : The run id} {--json}';

    protected $description = 'Show a run\'s parts, their own exits and how their output was kept';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, "/agent/processes/runs/{$this->argument('run')}/output", ['mode' => 'summary']);
    }
}
