<?php

declare(strict_types=1);

namespace App\Processes\Console;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use App\Processes\Enums\ShellDialect;
use App\Processes\Execution\ChannelRunEvents;
use App\Processes\Execution\Supervisor;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\ExecutionPlan;
use Illuminate\Console\Command;

/**
 * Runs an admitted command line on the host (doc 21 revision 6, section 53): it fetches the admission once, checks
 * the plan against the admitted tree digest, runs the supervisor and reports every event over the signed channel,
 * then prints the start of the output. A second start of the same admission runs nothing.
 */
#[JournalRoute(JournalRouteType::Write)]
final class RunProcessCommand extends Command
{
    /**
     * The most output printed here; every byte is stored on the server.
     */
    private const int PREVIEW_CHARACTERS = 4_000;

    /**
     * Variables a child never inherits: the journal's launch token and the run's event key.
     */
    private const array SECRET_VARIABLES = ['JOURNAL_LAUNCH_TOKEN', 'JOURNAL_EVENT_KEY'];

    protected $signature = 'process:run {--admission= : The admitted run to start}'
        .' {--line= : A shell line to admit and run directly} {--dialect=bash : bash, sh or zsh}'
        .' {--permit= : An evidence permit to run its exact command line once}'
        .' {--request-id= : The id this use of the line or permit goes under}';

    protected $description = 'Run an admitted command line under the supervisor and print the start of its output';

    public function handle(AgentRequestSender $journal, Supervisor $supervisor): int
    {
        if ($this->option('line') !== null) {
            return $this->runLine($journal, $supervisor);
        }

        return $this->runAdmission($journal, $supervisor, $this->admissionId($journal));
    }

    /**
     * Admits a direct line through the one shell admission; a refusal prints why and starts nothing.
     */
    private function runLine(AgentRequestSender $journal, Supervisor $supervisor): int
    {
        $requestId = (string) ($this->option('request-id') ?? bin2hex(random_bytes(16)));
        $answer = $journal->send('/agent/processes/admit', [
            'line' => (string) $this->option('line'),
            'dialect' => (string) $this->option('dialect'),
            'working_folder' => (string) getcwd(),
            'request_id' => $requestId,
        ])->body;
        if ($answer['allowed'] !== true) {
            $this->error("{$answer['code']}: {$answer['reason']} {$answer['notice']}");
            $this->line("Correction: {$answer['correction']}");
            if ($answer['request_id'] !== '') {
                $this->line("Request {$answer['request_id']}. Next: {$answer['next']}");
            }

            return self::FAILURE;
        }

        return $this->runAdmission($journal, $supervisor, (string) $answer['run_id']);
    }

    private function runAdmission(AgentRequestSender $journal, Supervisor $supervisor, string $admissionId): int
    {
        if ($admissionId === '') {
            $this->error('An evidence permit is required: a project owner issues one for the exact command line.');

            return self::FAILURE;
        }
        $admission = $journal->send('/agent/processes/admissions/'.$admissionId, [])->body;
        if ($admission['already_started'] === true) {
            $this->line("Run {$admission['run_id']} already started; nothing was started again.");

            return self::SUCCESS;
        }
        $plan = ExecutionPlan::fromArray($admission['plan']);
        if (! hash_equals((string) $admission['tree_digest'], $plan->treeDigest)) {
            $this->error('The plan does not match the admitted command line; nothing was started.');

            return self::FAILURE;
        }
        $folder = (string) $admission['working_folder'];
        $dialect = ShellDialect::from((string) $admission['dialect']);
        $context = new ExecutionContext($dialect, $folder, $folder, $this->environment());
        $spool = sys_get_temp_dir().'/journal-runs/'.$admission['run_id'];
        $runId = (string) $admission['run_id'];
        $events = new ChannelRunEvents($journal, $runId, (string) $admission['event_key'], $spool);
        $outcome = $supervisor->run($events, $plan, $context);
        $events->flush();
        $this->output->write(mb_substr($outcome->output, -self::PREVIEW_CHARACTERS));
        $this->printResults($journal, (string) $admission['run_id']);

        return $outcome->status;
    }

    /**
     * The output number and each part's result as the receipt gate answers it, never a pass read from the exit.
     */
    private function printResults(AgentRequestSender $journal, string $runId): void
    {
        $summary = $journal->send("/agent/processes/runs/{$runId}/output", ['mode' => 'summary'])->body;
        $this->line('');
        $this->line("Output {$runId}: read it with journal output read {$runId}");
        foreach ($summary['parts'] as $part) {
            $this->line("{$part['operation']}: {$part['result']}");
        }
    }

    /**
     * The admission to run: the one named, or the evidence run a permit starts for this request id.
     */
    private function admissionId(AgentRequestSender $journal): string
    {
        if ($this->option('permit') !== null) {
            $path = '/agent/processes/permits/'.$this->option('permit').'/runs';

            $started = $journal->send($path, ['request_id' => (string) $this->option('request-id')]);

            return (string) $started->body['run_id'];
        }

        return (string) $this->option('admission');
    }

    /**
     * @return array<string, string>
     */
    private function environment(): array
    {
        return array_diff_key(getenv(), array_flip(self::SECRET_VARIABLES));
    }
}
