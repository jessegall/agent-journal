<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Actions\AgentRuntimes;
use App\Agents\Enums\DriverType;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\AgentContext;
use App\Agents\Support\RuntimeIntent;
use App\Agents\Support\StackTarget;
use App\Bus\Support\OperationDeadline;
use App\Hooks\Actions\AgentStacks;
use App\Hooks\Actions\StartStacks;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Inputs\StopDetails;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Programs\ProgramCapabilities;
use App\Hooks\Programs\ProgramReplies;
use App\Hooks\Stack\AgentStateMachine;
use App\Hooks\Stack\HookAnswer;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Support\StackTransaction;
use App\Processes\Contracts\ShellCommandParser;
use App\Processes\Enums\ShellDialect;
use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskWorkState;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Hooks\ClosureStateLoader;
use Tests\Fixtures\Hooks\InMemoryTaskLoader;
use Tests\Fixtures\Hooks\ListedCommandParser;
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
        $this->tasks = new InMemoryTaskLoader([42 => TaskWorkState::Active, 43 => TaskWorkState::Active]);
        $this->app->scoped(ShellCommandParser::class, fn () => new ListedCommandParser());
        $tasks = $this->tasks;
        $this->app->make(Dispatcher::class)->listen(StateTypesRequested::class, function (
            StateTypesRequested $event,
        ) use ($tasks): void {
            $event->registry->register('test.tasks', $tasks);
            $event->registry->register('guide', new ClosureStateLoader(fn () => ScriptedState::delegating()));
            $event->registry->register('test.rewriting', new ClosureStateLoader(fn () => new RewritingState(
                ['composer test' => 'git status', 'make docs' => 'acme publish --docs'],
                new StateReference('guide', NoSubject::None),
            )));
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
            'claude',
            '1.0.0',
            'default',
            DriverType::Process,
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
            fn (HookAnswer $answer) => ProgramReplies::stop($answer),
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

    protected function capabilities(RewriteSupport $rewrites = RewriteSupport::WithoutApproval): ProgramCapabilities
    {
        return new ProgramCapabilities(
            'Test program',
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
            'start_tokens',
            'start_bypasses',
            'command_aliases',
            'program_conversations',
            'conversation_visits',
            'agent_runtimes',
            'process_runs',
            'part_runs',
            'command_requests',
        ];
    }

    private function hookIdentity(): HookIdentity
    {
        return TestActors::hookIdentity(1, 10, 'call-1', self::inputDigest());
    }
}
