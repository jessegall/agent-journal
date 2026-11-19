<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Calls\CheckRestoredOutputCall;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * A user checks a run's restored output files against their original checksums.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ProcessRestoreCheckCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'process:restore-check {run : The run whose output was restored}'
        .' {--request-key= : The key that makes a retry get the same answer} {--json}';

    protected $description = 'Check restored output against its original checksums';

    public function handle(): int
    {
        return $this->runCall(CheckRestoredOutputCall::from([
            'processRun' => (string) $this->argument('run'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
