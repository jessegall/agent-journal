<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\AgentRequests\Exceptions\AgentRequestFailed;
use App\AgentRequests\Support\AgentReply;
use App\Processes\Contracts\CommandClassifier;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Enums\LifecycleState;
use App\Processes\Enums\ShellDialect;
use App\Processes\Execution\ChannelRunEvents;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessEvent;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\ExecutionPlanner;
use App\Processes\Support\SpoolRecorder;
use App\Processes\Values\ExecutionContext;
use App\Processes\Values\PartKey;
use Illuminate\Support\Facades\Storage;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TestRunAdmissions;
use Tests\TestCase;

/**
 * process:run fetches its admission once and reports every part over the signed event channel; repeats change
 * nothing and a lost connection is made up from the host's spool (doc 21 revision 6, section 53).
 */
final class ProcessChannelTest extends TestCase
{
    use RefreshHookDatabase;
    use SendsSignedCalls;

    private TestLaunch $launch;

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake(SpoolRecorder::DISK);
        config(['processes.runner' => true]);
        $this->launch = TestLaunch::start();
        $this->runCommandsAs($this->launch);
        $this->folder = sys_get_temp_dir().'/channel-'.bin2hex(random_bytes(4));
        mkdir($this->folder);
    }

    public function test_process_run_records_every_part_and_a_second_start_runs_nothing(): void
    {
        $run = $this->admit("printf '{\"part\":\"ended\"}' && echo done");

        $this->artisan('process:run', ['--admission' => $run->id])->expectsOutputToContain('done')->assertExitCode(0);
        $this->artisan('process:run', ['--admission' => $run->id])->expectsOutputToContain('already started')->assertExitCode(0);

        $parts = PartRun::query()->where('process_run_id', $run->id)->orderBy('syntax_node')->get();
        $this->assertCount(2, $parts);
        $this->assertSame([LifecycleState::Ended, LifecycleState::Ended], $parts->map(fn (PartRun $part) => $part->lifecycle)->all());
        $this->assertSame(0, ProcessEvent::query()->where('process_run_id', $run->id)->where('type', ProcessEvent::OPERATIONAL_ERROR)->count());
    }

    public function test_replaying_the_spool_changes_nothing_and_a_lost_connection_is_made_up(): void
    {
        $run = $this->admit('echo hi');
        $eventKey = (string) $this->signed($this->launch, "/agent/processes/admissions/{$run->id}", [])->json('event_key');
        $sender = new class($this->app->make(AgentRequestSender::class)) implements AgentRequestSender
        {
            public bool $connected = false;

            public function __construct(private readonly AgentRequestSender $journal) {}

            public function send(string $path, array $body): AgentReply
            {
                return $this->connected ? $this->journal->send($path, $body) : throw new AgentRequestFailed('The connection was cut.');
            }
        };
        $events = new ChannelRunEvents($sender, $run->id, $eventKey, $this->folder.'/spool');
        $part = new PartKey(1, 1, 'echo');

        $events->queued($part);
        $events->startedInside($part, 'host');
        $sender->connected = true;
        $events->flush();
        $events->flush();

        $this->assertSame(2, ProcessEvent::query()->where('process_run_id', $run->id)->count());
        $this->assertSame(LifecycleState::Running, PartRun::query()->where('process_run_id', $run->id)->firstOrFail()->lifecycle);
    }

    private function admit(string $line): ProcessRun
    {
        $context = new ExecutionContext(ShellDialect::Bash, $this->folder, $this->folder);
        $tree = $this->app->make(ShellSyntax::class)->parse($line, ShellDialect::Bash);
        $plan = $this->app->make(ExecutionPlanner::class)->plan($tree, $this->app->make(CommandClassifier::class)->classify($tree, $context));

        return ProcessRun::admit(new ActorIdentity(ActorType::Agent, $this->launch->agent->id), TestRunAdmissions::of(line: $line, plan: $plan, workingFolder: $this->folder));
    }
}
