<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Api\Processes\ReadOutputSummaryPayload;
use App\Attributes\Console\JournalRoute;
use App\Console\Concerns\RunsApiPipelines;
use App\Enums\CommandRules\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Shows a run's parts with their lifecycle, own exits and capture state.
 */
#[JournalRoute(JournalRouteType::Read)]
final class ProcessShowCommand extends Command
{
    use RunsApiPipelines;

    protected $signature = 'process:show {run : The run id} {--json}';

    protected $description = 'Show a run\'s parts, their own exits and how their output was kept';

    public function handle(): int
    {
        return $this->runCall(ReadOutputSummaryPayload::from(['processRun' => (string) $this->argument('run')]));
    }
}
