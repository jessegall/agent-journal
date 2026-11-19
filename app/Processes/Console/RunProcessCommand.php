<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use App\Processes\Pipelines\RunProcessPipeline;
use App\Processes\Values\Run\ChildEnvironment;
use App\Processes\Values\Run\RunStart;
use Illuminate\Console\Command;

/**
 * Runs an admitted command line on the host (doc 21 revision 6, section 53) through RunProcessPipeline: it
 * fetches the admission once, checks the plan against the admitted tree digest, runs the supervisor and reports
 * every event over the signed channel, then prints the report. A second start of the same admission runs nothing.
 */
#[JournalRoute(JournalRouteType::Write)]
final class RunProcessCommand extends Command
{
    use RunsCallPipelines;

    /**
     * Variables a child never inherits: the journal's launch token and the run's event key.
     */
    protected $signature = 'process:run {--admission= : The admitted run to start} {--line= : A shell line to admit and run directly} {--dialect=bash : bash, sh or zsh} {--permit= : An evidence permit to run its exact command line once} {--request-key= : The key this use of the line or permit goes under, to get its answer again}';

    protected $description = 'Run an admitted command line under the supervisor and print the start of its output';

    public function handle(): int
    {
        return $this->runCalls(RunProcessPipeline::class, $this->start());
    }

    private function start(): RunStart
    {
        return new RunStart(
            $this->option('line') === null ? null : (string) $this->option('line'),
            (string) $this->option('dialect'),
            $this->option('permit') === null ? null : (string) $this->option('permit'),
            (string) $this->option('admission'),
            $this->requestKey(),
            (string) getcwd(),
            ChildEnvironment::ofThisProcess(),
        );
    }
}
