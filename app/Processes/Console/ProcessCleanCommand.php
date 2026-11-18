<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * A user removes the stored output of ended runs; --preview only lists what would go.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ProcessCleanCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'process:clean {run* : The ended runs}'
        .' {--preview : Only list what would be removed} {--json}';

    protected $description = 'Remove the stored output of ended runs';

    public function handle(AgentRequestSender $journal): int
    {
        return $this->sendAndPrint($journal, '/agent/processes/runs/clean', [
            'runs' => array_values(array_map(strval(...), (array) $this->argument('run'))),
            'preview' => (bool) $this->option('preview'),
        ]);
    }
}
