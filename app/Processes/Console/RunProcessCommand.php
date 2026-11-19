<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\Pipelines\Support\Pipelines;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use App\Processes\Enums\ReportLineType;
use App\Processes\Exceptions\AdmittedPlanChanged;
use App\Processes\Exceptions\EvidencePermitRequired;
use App\Processes\Pipelines\RunProcessPipeline;
use App\Processes\Values\Run\RunReport;
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
    /**
     * Variables a child never inherits: the journal's launch token and the run's event key.
     */
    private const array SECRET_VARIABLES = ['JOURNAL_LAUNCH_TOKEN', 'JOURNAL_EVENT_KEY'];

    protected $signature = 'process:run {--admission= : The admitted run to start}'
        .' {--line= : A shell line to admit and run directly} {--dialect=bash : bash, sh or zsh}'
        .' {--permit= : An evidence permit to run its exact command line once}'
        .' {--request-id= : The id this use of the line or permit goes under}';

    protected $description = 'Run an admitted command line under the supervisor and print the start of its output';

    public function handle(Pipelines $pipelines): int
    {
        try {
            $report = $pipelines->run(RunProcessPipeline::class, $this->start(), RunReport::class);
        } catch (EvidencePermitRequired|AdmittedPlanChanged $refusal) {
            $this->error($refusal->getMessage());

            return self::FAILURE;
        }

        foreach ($report->lines as $line) {
            match ($line->type) {
                ReportLineType::Line => $this->line($line->text),
                ReportLineType::Error => $this->error($line->text),
                ReportLineType::Output => $this->output->write($line->text),
            };
        }

        return $report->status;
    }

    private function start(): RunStart
    {
        return new RunStart(
            $this->option('line') === null ? null : (string) $this->option('line'),
            (string) $this->option('dialect'),
            $this->option('permit') === null ? null : (string) $this->option('permit'),
            (string) $this->option('admission'),
            (string) ($this->option('request-id') ?? bin2hex(random_bytes(16))),
            (string) getcwd(),
            array_diff_key(getenv(), array_flip(self::SECRET_VARIABLES)),
        );
    }
}
