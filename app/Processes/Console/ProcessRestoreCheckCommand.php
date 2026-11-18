<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * A user checks a run's restored output files against their original checksums.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ProcessRestoreCheckCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'process:restore-check {run : The run whose output was restored} {--json}';

    protected $description = 'Check restored output against its original checksums';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, "/agent/processes/runs/{$this->argument('run')}/restore-check", []);
    }
}
