<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\SendsSignedCalls;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Reads a run's stored output: the summary of every part, or the last lines or a search of one part's stream. It
 * never runs the command again.
 */
#[JournalRoute(JournalRouteType::Read)]
final class OutputReadCommand extends Command
{
    use SendsSignedCalls;

    protected $signature = 'output:read {run : The run id} {--part=0 : The syntax node of the part} {--stream=stdout} {--summary} {--search=} {--tail=20} {--json}';

    protected $description = 'Read a run\'s stored output without running anything again';

    public function handle(AgentRequestSender $journal): int
    {
        $mode = match (true) {
            (bool) $this->option('summary') => 'summary',
            $this->option('search') !== null => 'search',
            default => 'tail',
        };

        return $this->sendAndPrint($journal, "/agent/processes/runs/{$this->argument('run')}/output", [
            'mode' => $mode,
            'part' => (int) $this->option('part'),
            'stream' => (string) $this->option('stream'),
            'tail' => (int) $this->option('tail'),
            'search' => (string) $this->option('search'),
        ]);
    }
}
