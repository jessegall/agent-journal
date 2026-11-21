<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Calls\ReadOutputSummaryCall;
use App\Processes\Calls\ReadOutputTailCall;
use App\Processes\Calls\SearchOutputCall;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Console\Command;

/**
 * Reads a run's stored output: the summary of every part, or the last lines or a search of one part's stream. It
 * never runs the command again.
 */
#[JournalRoute(JournalRouteType::Read)]
final class OutputReadCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'output:read {run : The run id} {--part=0 : The syntax node of the part} {--stream=stdout} {--summary} {--search=} {--tail=20} {--json}';

    protected $description = 'Read a run\'s stored output without running anything again';

    public function handle(): int
    {
        $run = (string) $this->argument('run');

        $place = [
            'processRun' => $run,
            'part' => (int) $this->option('part'),
            'stream' => (string) $this->option('stream'),
        ];

        $text = (string) $this->option('search');

        return $this->runCall(match (true) {
            $this->option('summary') === true => ReadOutputSummaryCall::from(['processRun' => $run]),
            $this->option('search') !== null => SearchOutputCall::from([...$place, 'text' => $text]),
            default => ReadOutputTailCall::from([...$place, 'lines' => (int) $this->option('tail')]),
        });
    }
}
