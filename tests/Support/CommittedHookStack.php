<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Calls\Hooks\AgentStateMachine;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Processes\ShellCommandParser;
use App\Enums\DriverVariant;
use App\Enums\NoSubject;
use App\Enums\RewriteSupport;
use App\Enums\ShellDialect;
use App\Events\StateTypesRequested;
use App\Models\Agent;
use App\Models\AgentSession;
use App\Models\AgentStackRow;
use App\Support\ActorContext;
use App\Support\AgentContext;
use App\Support\AgentRuntimes;
use App\Support\AgentStacks;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Drivers\DriverReplies;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\StopDetails;
use App\Support\OperationDeadline;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use App\Support\SignedCall;
use App\Support\Stack\HookAnswer;
use App\Support\StackTransaction;
use App\Support\StartStacks;
use App\Support\Storage\FrameRecord;
use App\Values\RuntimeIntent;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskState;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Hooks\ClosureStateLoader;
use Tests\Fixtures\Hooks\InMemoryTaskLoader;
use Tests\Fixtures\Hooks\ListedCommandParser;
use Tests\Fixtures\Hooks\MessagingState;
use Tests\Fixtures\Hooks\RewritingState;
use Tests\Fixtures\Hooks\ScriptedState;

/**
 * Hook tests that commit real rows on the hook database: no wrapping transaction, every committed table emptied before
 * and after each test, the test state types, and a started stack for agent 1, session 10.
 */
trait CommittedHookStack
{
    use RefreshHookDatabase;

    protected InMemoryTaskLoader $tasks;

    protected StackTarget $target;

    /**
     * @return array<int, string>
     */
    protected function connectionsToTransact(): array
    {
        return [];
    }

    protected function setUpCommittedHookStack(): void
    {
        $this->emptyTables(...self::committedTables());
        config(['processes.runner' => true]);
        $this->target = $this->startedTarget();
        $this->openRuntime();
        $this->tasks = new InMemoryTaskLoader([42 => TaskState::Started, 43 => TaskState::Started]);
        $this->app->scoped(ShellCommandParser::class, fn () => new ListedCommandParser());
        $tasks = $this->tasks;
        $this->app->make(Dispatcher::class)->listen(StateTypesRequested::class, function (
            StateTypesRequested $event,
        ) use ($tasks): void {
            $event->registry->register('test.tasks', $tasks);
            $event->registry->register(
                'guide',
                new ClosureStateLoader(ScriptedState::class, fn () => ScriptedState::passing()),
            );
            $event->registry->register(
                'test.messaging',
                new ClosureStateLoader(MessagingState::class, fn () => new MessagingState()),
            );
            $event->registry->register(
                'test.rewriting',
                new ClosureStateLoader(RewritingState::class, fn () => new RewritingState(
                    ['composer test' => 'git status', 'make docs' => 'acme publish --docs'],
                    new StateReference('guide', NoSubject::None),
                )),
            );
        });
        $this->callAs('call-1');
        $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(StartStacks::class)->open($this->target),
        );
    }

    /**
     * Agent 1 with its active session 10, as rows, so a command that resolves the session finds it; a row a test left
     * behind is reused.
     */
    private function startedTarget(): StackTarget
    {
        $agent = Agent::query()->find(TestIds::of(1)) ?? new Agent(
            ['name' => 'Hook agent', 'profile_key' => 'main-agent'],
        );
        $agent->id = TestIds::of(1);
        $agent->save();
        $session = AgentSession::query()->find(TestIds::of(10)) ?? new AgentSession(TestSelections::sessionColumns());
        $session->id = TestIds::of(10);
        $session->agent_id = $agent->id;
        $session->save();

        return new StackTarget($agent->id, $session->id);
    }

    /**
     * The started session's runtime, working in the project folder, so an admitted line has a runner to run in.
     */
    private function openRuntime(): void
    {
        $session = AgentSession::query()->findOrFail($this->target->sessionId);
        $intent = new RuntimeIntent(
            TestIds::of(30),
            base_path(),
            'claude-code',
            '1.0.0',
            'default',
            DriverVariant::Headless,
            null,
            null,
            null,
        );
        $this->app->make(AgentRuntimes::class)->open($session, $intent, 'start-token');
    }

    protected function tearDownCommittedHookStack(): void
    {
        $this->emptyTables(...self::committedTables());
    }

    /**
     * The answer the machine gives a stop from the started agent under this call id.
     */
    protected function answerStop(string $callId): string
    {
        $this->callAs($callId);

        return $this->machine()->answer(
            $this->stop(),
            $this->capabilities(),
            new OperationDeadline(3000),
            fn (HookAnswer $answer) => DriverReplies::stop($answer),
        )->stdout;
    }

    protected function callAs(string $callId, string|null $inputDigest = null): void
    {
        $this->app->instance(
            AgentContext::class,
            new AgentContext(
                TestIds::of(1),
                TestIds::of(10),
                new SignedCall($callId, CarbonImmutable::now(), $inputDigest ?? self::inputDigest()),
                null,
            ),
        );
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent(TestIds::of(1)),
            TestStartAuthority::forAgent(TestIds::of(1)),
        );
    }

    protected function pushState(StateReference $state): void
    {
        $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(AgentStacks::class)->push($this->target, $state),
        );
    }

    protected function task(int $number): StateReference
    {
        return new StateReference('test.tasks', new SubjectReference((string) $number, 1));
    }

    protected function machine(): AgentStateMachine
    {
        return $this->app->make(AgentStateMachine::class);
    }

    protected function capabilities(RewriteSupport $rewrites = RewriteSupport::WithoutApproval): DriverCapabilities
    {
        return new DriverCapabilities(
            'Test driver',
            'pre-tool and stop replies',
            ['onShellCommand', 'onStop'],
            $rewrites,
        );
    }

    protected function stop(): StopRequested
    {
        return new StopRequested($this->hookIdentity(), new StopDetails('turn-1', false));
    }

    protected function shell(string $line): ShellCommandRequested
    {
        return new ShellCommandRequested(
            $this->hookIdentity(),
            new ListedCommandParser()->parse($line, ShellDialect::Bash),
        );
    }

    /**
     * @return list<string>
     */
    protected function storedTypeKeys(): array
    {
        return array_map(
            fn (FrameRecord $frame) => $frame->reference->typeKey,
            AgentStackRow::query()->forTarget($this->target)->sole()->frames->all(),
        );
    }

    protected static function inputDigest(string $input = 'the input'): string
    {
        return hash('sha256', $input);
    }

    /**
     * @return list<string>
     */
    private static function committedTables(): array
    {
        return [
            'agent_stacks',
            'hook_calls',
            'links',
            'tasks',
            'messages',
            'sequence_runs',
            'memories',
            'rules',
            'users',
            'agents',
            'agent_sessions',
            'session_policies',
            'start_tokens',
            'start_bypasses',
            'command_aliases',
            'driver_conversations',
            'conversation_visits',
            'agent_runtimes',
            'process_runs',
            'part_runs',
            'command_requests',
            'driver_requests',
            'pending_agent_messages',
        ];
    }

    private function hookIdentity(): HookIdentity
    {
        return TestActors::hookIdentity(1, 10, 'call-1', self::inputDigest());
    }
}
