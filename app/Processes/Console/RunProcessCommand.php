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

    protected $signature = 'process:run {--admission= : The admitted run to start}';

    protected $description = 'Run an admitted command line under the supervisor and print the start of its output';

    public function handle(AgentRequestSender $journal, Supervisor $supervisor): int
    {
        $admission = $journal->send('/agent/processes/admissions/'.$this->admissionId(), [])->body;
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
        $context = new ExecutionContext(ShellDialect::from((string) $admission['dialect']), $folder, $folder, $this->environment());
        $events = new ChannelRunEvents($journal, (string) $admission['run_id'], (string) $admission['event_key'], sys_get_temp_dir().'/journal-runs/'.$admission['run_id']);
        $outcome = $supervisor->run($events, $plan, $context);
        $events->flush();
        $this->output->write(mb_substr($outcome->output, 0, self::PREVIEW_CHARACTERS));

        return $outcome->status;
    }

    private function admissionId(): string
    {
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
