<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Calls\CleanOutputCall;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * A user removes the stored output of ended runs; --preview only lists what would go.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ProcessCleanCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'process:clean {run* : The ended runs} {--preview : Only list what would be removed} {--request-key= : The key that makes a retry get the same answer} {--json}';

    protected $description = 'Remove the stored output of ended runs';

    public function handle(): int
    {
        return $this->runCall(CleanOutputCall::from([
            'runs' => array_values(array_map(strval(...), (array) $this->argument('run'))),
            'preview' => (bool) $this->option('preview'),
            'requestKey' => $this->requestKey(),
        ]));
    }
}
