<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Console\Concerns\RunsCallPipelines;
use App\AgentRequests\Values\CommandReport;
use App\Pipelines\Support\PipelineRunner;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Calls\ProcessCalls;
use App\Processes\Enums\JournalRouteType;
use App\Processes\Pipelines\RunAdmissionPipeline;
use App\Processes\Values\Run\AdmissionToRun;
use App\Processes\Values\Run\ChildEnvironment;
use Illuminate\Console\Command;

/**
 * Runs a request's approved sample once under its permit, supervised as every run is, then settles the request: on to
 * the proof when the evidence is complete, back to the owner otherwise.
 */
#[JournalRoute(JournalRouteType::Write)]
final class ReaderSampleRunCommand extends Command
{
    use RunsCallPipelines;

    protected $signature = 'reader:sample-run {request : The command request id} {--permit= : The evidence permit the owner issued} {--request-key= : The key this use of the permit goes under} {--json}';

    protected $description = 'Run the approved evidence sample of a command request once';

    public function handle(ProcessCalls $processes, PipelineRunner $pipelines): int
    {
        $commandRequest = (string) $this->argument('request');
        $key = $this->requestKey();

        return $this->runReport(function () use ($processes, $pipelines, $commandRequest, $key): CommandReport {
            $started = $processes->startSample($commandRequest, (string) $this->option('permit'), $key);
            $admission = new AdmissionToRun($started->runId, $key, ChildEnvironment::ofThisProcess());
            $report = $pipelines->run(RunAdmissionPipeline::class, $admission, CommandReport::class);
            $settled = $processes->settleSample($commandRequest, $key);
            $layout = $this->option('json') === true ? 0 : JSON_PRETTY_PRINT;
            $flags = JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | $layout;

            return $report->line((string) json_encode($settled->toArray(), $flags));
        });
    }
}
