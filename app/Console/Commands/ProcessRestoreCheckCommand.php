<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Processes\CheckRestoredOutputPayload;
use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsApiPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

/**
 * A user checks a run's restored output files against their original checksums.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ProcessRestoreCheckCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'process:restore-check {run : The run whose output was restored} {--request-key= : The key that makes a retry get the same answer} {--json}';

    protected $description = 'Check restored output against its original checksums';

    public function handle(): int
    {
        return $this->runCall(CheckRestoredOutputPayload::from([
            'processRun' => (string) $this->argument('run'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
