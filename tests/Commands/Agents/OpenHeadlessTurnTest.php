<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\ChangeAgentModel\ChangeAgentModelCommand;
use App\Agents\Commands\CheckSignIn\CheckSignInCommand;
use App\Agents\Commands\DeliverAgent\DeliverAgentCommand;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Commands\NotifyRuntimeActivity\NotifyRuntimeActivityCommand;
use App\Agents\Drivers\Commands\NotifyRuntimeActivity\NotifyRuntimeActivityHandler;
use App\Agents\Drivers\Commands\OpenHeadlessTurn\OpenHeadlessTurnCommand;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Agents\Drivers\Enums\RetryOutcome;
use App\Agents\Drivers\Exceptions\WorkerReportFailed;
use App\Agents\Drivers\Work\DriverWorkers;
use App\Agents\Drivers\Work\RequestRetries;
use App\Bus\Contracts\CommandHandler;
use App\Hosts\Commands\ClaimHostInstructions\ClaimHostInstructionsCommand;
use App\Hosts\Commands\NotifyHostInventory\NotifyHostInventoryCommand;
use App\Hosts\Commands\SweepHostInstructions\SweepHostInstructionsCommand;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Protocol\HostProcessReportType;
use App\Hosts\Protocol\HostRefusal;
use App\Hosts\Protocol\Payloads\HostInventoryPayload;
use App\Jobs\ContinueAgentWhenDue;
use App\Messages\Data\MessageTextData;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\RetryAttempt;
use App\Models\Hosts\HostProcess;
use App\Processes\Enums\RuntimeActivity;
use App\Sessions\OpenedRuntime;
use App\Time\Contracts\Sleeper;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Exceptions;
use PHPUnit\Framework\Attributes\DataProvider;
use RuntimeException;
use Tests\Support\Agents\TestAgent;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\FakeMonotonicClock;
use Tests\Support\FakeSleeper;
use Tests\Support\Hosts\TestHostInstruction;
use Tests\Support\Hosts\TestHostProcess;
use Tests\TestCase;

/**
 * A runtime the journal drives itself opens a turn for its waiting work only once its build and sign-in are proven,
 * one turn at a time, the prompt in the turn's argv; the next work waits for the turn to end and then resumes the
 * conversation.
 */
#[TestsCommand(OpenHeadlessTurnCommand::class)]
final class OpenHeadlessTurnTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'hosts', 'host_processes', 'host_instructions', 'agents', 'agent_sessions', 'session_tokens', 'agent_stacks',
        'hook_calls', 'agent_runtimes', 'driver_requests', 'driver_turns', 'accounts', 'active_accounts',
        'session_processes', 'session_requests', 'inboxes', 'inbox_members', 'links', 'users', 'retry_attempts',
    ];

    public function test_work_waits_for_the_proven_build_then_runs_one_turn_at_a_time(): void
    {
        $this->journal
            ->owner()
            ->chooseActiveAccounts()
            ->showDriverArrangements()
            ->idleAgent('Driven')
            ->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->openRuntime('Mac', base_path(), firstMessage: 'Run: ls.'));
        $opened = $this->journal->openedRuntimeOf('Driven');
        $this->journal->assertResult(0, $this->turnCount($opened->runtimeId));

        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven->passBuildProbe('driven'));
        $this->journal->assertResult(0, $this->turnCount($opened->runtimeId));
        $folder = $this->journal->startOfSession($opened->sessionId)->directory;
        $status = json_encode(['loggedIn' => true, 'authMethod' => 'claude.ai', 'configDirectory' => $folder]);
        $signIn = $this->journal->hostProcessCalled('driven-sign-in')->id;
        $this->journal->asSystem(new CheckSignInCommand($signIn, (string) $status));
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->nameProcess('first', HostProcessPurpose::AgentTurn));

        $second = $this->journal->asOwner(new DeliverAgentCommand(
            $this->journal->agentCalled('Driven')->id,
            $opened->sessionId,
            'second',
            [new MessageTextData('And then: pwd.')],
        ));
        $this->journal->assertResult(1, $this->turnCount($opened->runtimeId));

        $this->endFirstTurn($opened);
        $this->journal->asSystem(new OpenHeadlessTurnCommand($opened->runtimeId));
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->nameProcess('second', HostProcessPurpose::AgentTurn));

        $this->journal->assertResult(
            ['Run: ls.', false, 'And then: pwd.', true, RequestProgress::Staged],
            [
                $this->promptOf('first'),
                in_array('--resume', $this->argvOf('first'), true),
                $this->promptOf('second'),
                in_array('--resume', $this->argvOf('second'), true),
                DriverRequest::query()->whereKey($second->requestId)->sole()->progress,
            ],
        );
    }

    /**
     * A model change runs nothing on a headless runtime: the next turn's start applies it and runs at the model, and
     * the runtime keeps the model for the starts after it.
     */
    public function test_a_model_change_is_applied_by_the_next_turn_start(): void
    {
        $opened = $this->runtimeOnItsFirstTurn();
        $agentId = $this->journal->agentCalled('Driven')->id;
        $change = $this->journal->asOwner(
            new ChangeAgentModelCommand($agentId, $opened->sessionId, 'model-1', 'claude-haiku-5-5'),
        );
        $this->journal->asOwner(
            new DeliverAgentCommand($agentId, $opened->sessionId, 'second', [new MessageTextData('And then: pwd.')]),
        );

        $this->endFirstTurn($opened);
        $this->journal->asSystem(new OpenHeadlessTurnCommand($opened->runtimeId));
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->nameProcess('second', HostProcessPurpose::AgentTurn));

        $argv = $this->argvOf('second');
        $this->journal->assertResult(
            [RequestProgress::Applied, 'claude-haiku-5-5', 'claude-haiku-5-5', 'And then: pwd.'],
            [
                DriverRequest::query()->whereKey($change->requestId)->sole()->progress,
                $argv[array_search('--model', $argv, true) + 1],
                AgentRuntime::query()->whereKey($opened->runtimeId)->sole()->requested_model,
                $this->promptOf('second'),
            ],
        );
    }

    /**
     * The driven agent's runtime with its build and sign-in proven and its first turn, named first, running.
     */
    /**
     * A turn that answered and was then lost with its restarted host, before its exit was seen, is followed by the next
     * turn for work that arrived while it still looked live, as nothing else would take that work.
     */
    public function test_a_lost_turn_is_followed_by_a_turn_for_the_work_that_waits(): void
    {
        $opened = $this->runtimeOnItsFirstTurn();
        $this->journal->asOwner(new DeliverAgentCommand(
            $this->journal->agentCalled('Driven')->id,
            $opened->sessionId,
            'second',
            [new MessageTextData('And then: pwd.')],
        ));
        $this->journal->hostProcess('driven-sign-in', fn (TestHostProcess $signIn) => $signIn
            ->report(HostProcessReportType::Running)->report(HostProcessReportType::Exited, 0));
        [$firstOpen] = $this->journal->hostInstructionsOf('first');
        $this->journal->hostInstruction($firstOpen, fn (TestHostInstruction $instruction) => $instruction->answer())
            ->hostProcess('first', fn (TestHostProcess $first) => $first->report(HostProcessReportType::Running));
        $first = DriverRequest::query()->findOrFail($firstOpen->driver_request_id);
        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $this->journal->hostCalled('Mac')->hostId,
            $first->id,
            $first->attempt_version,
            RequestProgress::Applied,
            AgentRuntime::query()->whereKey($opened->runtimeId)->sole()->conversation_id,
            null,
        ));
        $inventory = HostInventoryPayload::from([
            'protocol' => 1,
            'release' => '6.0.0',
            'answered_through' => $firstOpen->id,
            'capabilities' => [],
            'processes' => [],
        ]);

        $this->journal->asSystem(new NotifyHostInventoryCommand($this->journal->hostCalled('Mac')->hostId, $inventory));
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->nameProcess('second', HostProcessPurpose::AgentTurn));

        $this->journal->assertResult(
            [HostProcessStatus::Lost, 2, 'And then: pwd.'],
            [
                $this->journal->hostProcessCalled('first')->status,
                $this->turnCount($opened->runtimeId),
                $this->promptOf('second'),
            ],
        );
    }

    public function test_the_driver_continues_a_proven_runtime_whose_work_waits_by_opening_its_next_turn(): void
    {
        $opened = $this->runtimeOnItsFirstTurn();
        $this->journal->asOwner(new DeliverAgentCommand(
            $this->journal->agentCalled('Driven')->id,
            $opened->sessionId,
            'second',
            [new MessageTextData('And then: pwd.')],
        ));
        $this->endFirstTurn($opened);
        $runtime = AgentRuntime::query()->whereKey($opened->runtimeId)->sole();

        $this->journal->service(DriverCatalogue::class)->forRuntime($runtime)->continueAgent($runtime);

        $this->journal->assertResult(2, $this->turnCount($opened->runtimeId));
    }

    /**
     * The turn's driver tells what the agent does: working while the turn runs, idle once it ended, and an idle agent
     * stays idle, not unknown, however long it waits for the next message.
     */
    public function test_a_turn_shows_its_agent_working_then_idle_and_idle_holds(): void
    {
        $opened = $this->runtimeOnItsFirstTurn();
        $this->journal->hostProcess('first', fn (TestHostProcess $first) => $first
            ->report(HostProcessReportType::Running)->beginWorker());
        $working = AgentRuntime::query()->whereKey($opened->runtimeId)->sole()->activity;

        $this->journal->hostProcess('first', fn (TestHostProcess $first) => $first
            ->report(HostProcessReportType::Exited, 0)->drive());
        $idle = AgentRuntime::query()->whereKey($opened->runtimeId)->sole();

        $this->journal->assertResult(
            [RuntimeActivity::Running, RuntimeActivity::Idle, false],
            [$working, $idle->activity, $idle->isStale(CarbonImmutable::now()->addHour())],
        );
    }

    /**
     * @return iterable<string, array{bool}>
     */
    public static function retryTriggers(): iterable
    {
        yield 'delayed job' => [true];
        yield 'sweep after a lost job' => [false];
    }

    #[DataProvider('retryTriggers')]
    public function test_an_unclaimed_open_retries_once_after_its_wait(bool $useJob): void
    {
        $now = CarbonImmutable::now()->startOfSecond();
        $this->journal->useServerClockAt($now);
        $opened = $this->runtimeOnItsFirstTurn();
        [$first] = $this->journal->hostInstructionsOf('first');
        $request = DriverRequest::query()->findOrFail($first->driver_request_id);
        $this->journal->moveServerClockTo($first->expires_at->addSecond())
            ->asSystem(new SweepHostInstructionsCommand());

        $attempt = RetryAttempt::query()->ofSession($opened->sessionId)->sole();
        $this->assertSame([$request->id, 5, 1], [$attempt->driver_request_id, $attempt->wait_seconds, $attempt->retry]);
        $this->assertSame(HostProcessStatus::Lost, $this->journal->hostProcessCalled('first')->refresh()->status);
        $retries = $this->journal->service(RequestRetries::class);
        $job = new ContinueAgentWhenDue($request->id);
        $this->journal->moveServerClockTo($attempt->retry_at->subSecond());
        $job->handle($retries);
        $this->assertSame(1, $this->turnCount($opened->runtimeId));

        $this->journal->moveServerClockTo($attempt->retry_at);

        if ($useJob) {
            $job->handle($retries);
        } else {
            $retries->sweep();
        }

        $retries->sweep();
        $job->handle($retries);
        $this->assertSame(2, $this->turnCount($opened->runtimeId));
        $this->assertSame(RequestProgress::Staged, $request->refresh()->progress);
    }

    public function test_an_expired_open_its_host_had_claimed_leaves_delivery_uncertain(): void
    {
        $this->journal->useServerClockAt(CarbonImmutable::now()->startOfSecond());
        $opened = $this->runtimeOnItsFirstTurn();
        [$first] = $this->journal->hostInstructionsOf('first');
        $this->journal->asSystem(new ClaimHostInstructionsCommand($first->host_id, 10));
        $this->assertNotNull($first->refresh()->claimed_at);
        $this->journal->hostInstruction($first, fn (TestHostInstruction $open) => $open->refuse(HostRefusal::Expired));

        $request = DriverRequest::query()->findOrFail($first->driver_request_id);
        $this->assertSame(RequestProgress::DeliveryUncertain, $request->progress);
        $this->assertSame(1, $this->turnCount($opened->runtimeId));
        $this->assertFalse(RetryAttempt::query()->ofSession($opened->sessionId)->exists());
    }

    public function test_a_worker_report_that_fails_twice_waits_five_then_ten_seconds(): void
    {
        $opened = $this->runtimeOnItsFirstTurn();
        $this->journal->hostProcess('first', fn (TestHostProcess $turn) => $turn->report(HostProcessReportType::Running));
        $clock = $this->failActivityReports(2);
        $this->journal->service(DriverWorkers::class)->begin($this->journal->hostProcessCalled('first')->id);

        $history = RetryAttempt::query()->ofSession($opened->sessionId)->orderBy('retry')->limit(4)->get();
        $this->assertSame([5, 10], $history->pluck('wait_seconds')->all());
        $this->assertSame([RetryOutcome::Failed, RetryOutcome::Succeeded], $history->pluck('outcome')->all());
        $this->assertSame(15_000_000_000, $clock->nanoseconds());
    }

    public function test_the_worker_exits_with_failure_after_exhausting_its_report_retries(): void
    {
        $opened = $this->runtimeOnItsFirstTurn();
        Exceptions::fake();
        $process = $this->journal->hostProcessCalled('first');
        $this->journal->hostProcess('first', fn (TestHostProcess $turn) => $turn->report(HostProcessReportType::Running));
        $clock = $this->failActivityReports(4);
        $this->artisan('drivers:work', ['process' => $process->id])->assertFailed();

        Exceptions::assertReported(WorkerReportFailed::class);
        $last = RetryAttempt::query()->ofSession($opened->sessionId)->orderByDesc('retry')->firstOrFail();
        $this->assertSame(RetryOutcome::GaveUp, $last->outcome);
        $this->assertSame(35_000_000_000, $clock->nanoseconds());
    }

    private function failActivityReports(int $failures): FakeMonotonicClock
    {
        $clock = new FakeMonotonicClock();
        $this->app->instance(Sleeper::class, new FakeSleeper($clock));
        $handler = $this->journal->service(NotifyRuntimeActivityHandler::class);
        $this->app->instance(NotifyRuntimeActivityHandler::class, new class($handler, $failures) implements CommandHandler
        {
            public function __construct(private NotifyRuntimeActivityHandler $handler, private int $failures) {}

            public function handle(NotifyRuntimeActivityCommand $command): void
            {
                if ($this->failures-- > 0) {
                    throw new RuntimeException('The activity report did not commit.');
                }

                $this->handler->handle($command);
            }
        });

        return $clock;
    }

    private function runtimeOnItsFirstTurn(): OpenedRuntime
    {
        $this->journal
            ->owner()
            ->chooseActiveAccounts()
            ->showDriverArrangements()
            ->idleAgent('Driven')
            ->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->openRuntime('Mac', base_path(), firstMessage: 'Run: ls.')
            ->passBuildProbe('driven'));
        $opened = $this->journal->openedRuntimeOf('Driven');
        $folder = $this->journal->startOfSession($opened->sessionId)->directory;
        $status = json_encode(['loggedIn' => true, 'authMethod' => 'claude.ai', 'configDirectory' => $folder]);
        $signIn = $this->journal->hostProcessCalled('driven-sign-in')->id;
        $this->journal->asSystem(new CheckSignInCommand($signIn, (string) $status));
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->nameProcess('first', HostProcessPurpose::AgentTurn));

        return $opened;
    }

    /**
     * The first turn's process exits and its driver reports the turn's request applied.
     */
    private function endFirstTurn(OpenedRuntime $opened): void
    {
        $this->journal->hostProcess('first', fn (TestHostProcess $first) => $first
            ->report(HostProcessReportType::Running)->report(HostProcessReportType::Exited, 0));
        $first = DriverRequest::query()->findOrFail($this->journal->hostInstructionsOf('first')[0]->driver_request_id);
        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $this->journal->hostCalled('Mac')->hostId,
            $first->id,
            $first->attempt_version,
            RequestProgress::Applied,
            AgentRuntime::query()->whereKey($opened->runtimeId)->sole()->conversation_id,
            null,
        ));
    }

    private function turnCount(string $runtimeId): int
    {
        return HostProcess::query()
            ->where('agent_runtime_id', $runtimeId)
            ->where('purpose', HostProcessPurpose::AgentTurn)
            ->count();
    }

    /**
     * @return list<string>
     */
    private function argvOf(string $name): array
    {
        return $this->journal->payloadOf($this->journal->hostInstructionsOf($name)[0])['argv'];
    }

    private function promptOf(string $name): string
    {
        $argv = $this->argvOf($name);

        return $argv[array_key_last($argv)];
    }
}
