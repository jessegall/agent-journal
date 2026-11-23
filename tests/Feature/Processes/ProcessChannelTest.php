<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Calls\Processes\ProcessCalls;
use App\Contracts\Bus\CommandClassifier;
use App\Contracts\Files\Files;
use App\Enums\ActorType;
use App\Enums\LifecycleState;
use App\Enums\ShellDialect;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessEvent;
use App\Models\Runs\ProcessRun;
use App\Support\ActorIdentity;
use App\Support\Execution\ChannelRunEvents;
use App\Support\ExecutionPlanner;
use App\Support\Syntax\TreeParser;
use App\Values\ExecutionContext;
use App\Values\PartKey;
use Psr\Log\LoggerInterface;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Processes\ProcessOutputDisk;
use Tests\Support\RecordedCalls;
use Tests\Support\RecordingLogger;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TestRunAdmissions;
use Tests\TestCase;
use Throwable;

/**
 * process:run fetches its admission once and reports every part over the signed event channel; repeats change
 * nothing and a lost connection is made up from the host's spool (doc 21 revision 6, section 53).
 */
final class ProcessChannelTest extends TestCase
{
    use RefreshHookDatabase;
    use SendsSignedCalls;

    private TestStart $start;

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        ProcessOutputDisk::fake();
        config(['processes.runner' => true]);
        $this->start = TestStart::start();
        $this->runCommandsAs($this->start);
        $this->folder = sys_get_temp_dir().'/channel-'.bin2hex(random_bytes(4));
        mkdir($this->folder);
    }

    public function test_process_run_records_every_part_and_a_second_start_runs_nothing(): void
    {
        $run = $this->admit("printf '{\"part\":\"ended\"}' && echo done");

        $this->artisan('process:run', ['--admission' => $run->id])->expectsOutputToContain('done')->assertExitCode(0);
        $this->artisan(
            'process:run',
            ['--admission' => $run->id],
        )->expectsOutputToContain('already started')->assertExitCode(0);

        $parts = PartRun::query()->where('process_run_id', $run->id)->orderBy('syntax_node')->get();
        $this->assertCount(2, $parts);
        $this->assertSame(
            [LifecycleState::Ended, LifecycleState::Ended],
            $parts->map(fn (PartRun $part) => $part->lifecycle)->all(),
        );
        $this->assertSame(
            0,
            ProcessEvent::query()->where('process_run_id', $run->id)->where(
                'type',
                ProcessEvent::OPERATIONAL_ERROR,
            )->count(),
        );
    }

    public function test_replaying_the_spool_changes_nothing_and_a_lost_connection_is_made_up(): void
    {
        $run = $this->admit('echo hi');
        $eventKey = (string) $this->signed(
            $this->start,
            "/agent/processes/admissions/{$run->id}",
            ['request_key' => 'channel-1'],
        )->json('event_key');
        $calls = new RecordedCalls();
        $files = $this->app->make(Files::class);
        $events = new ChannelRunEvents(
            new ProcessCalls($calls),
            $run->id,
            $eventKey,
            $files->filePathOf($this->folder.'/spool'),
            $files,
            $this->app->make(LoggerInterface::class),
        );
        $part = new PartKey(1, 1, 'echo');

        $events->queued($part);
        $events->startedInside($part, 'host');
        $calls->passThrough();
        $events->flush();
        $events->flush();

        $this->assertSame(2, ProcessEvent::query()->where('process_run_id', $run->id)->count());
        $this->assertSame(
            LifecycleState::Running,
            PartRun::query()->where('process_run_id', $run->id)->firstOrFail()->lifecycle,
        );
    }

    public function test_a_send_that_fails_leaves_the_events_spooled_and_logs_why(): void
    {
        $run = $this->admit('echo hi');
        $calls = new RecordedCalls();
        $files = $this->app->make(Files::class);
        $logger = new RecordingLogger();
        $events = new ChannelRunEvents(
            new ProcessCalls($calls),
            $run->id,
            'key',
            $files->filePathOf($this->folder.'/spool-failing'),
            $files,
            $logger,
        );

        $events->queued(new PartKey(1, 1, 'echo'));
        $events->flush();

        $context = $logger->contextOf('processes.run_events_not_sent');
        $this->assertTrue($events->isWaitingToSend());
        $this->assertSame($run->id, $context['run_id']);
        $this->assertArrayHasKey('failure', $context);
        $this->assertInstanceOf(Throwable::class, $context['exception']);
    }

    private function admit(string $line): ProcessRun
    {
        $context = new ExecutionContext(ShellDialect::Bash, $this->folder, $this->folder);
        $tree = $this->app->make(TreeParser::class)->parse($line, ShellDialect::Bash);
        $plan = $this->app->make(ExecutionPlanner::class)->plan(
            $tree,
            $this->app->make(CommandClassifier::class)->classify($tree, $context),
        );

        return ProcessRun::create(
            new ActorIdentity(ActorType::Agent, $this->start->agent->id),
            TestRunAdmissions::of(line: $line, plan: $plan, workingFolder: $this->folder),
        );
    }
}
