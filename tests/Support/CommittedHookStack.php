<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Api\Hooks\AgentStateMachine;
use App\Contracts\Actors\AgentTexts;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Processes\ShellCommandParser;
use App\Enums\Drivers\DriverType;
use App\Enums\Drivers\RewriteSupport;
use App\Enums\Engine\NoSubject;
use App\Enums\Processes\ShellDialect;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Agents\AgentStackRow;
use App\Models\Inboxes\Inbox;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\ActorProvisioning;
use App\Support\AgentContext;
use App\Support\AgentRuntimes;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Drivers\DriverReplies;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\StopDetails;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use App\Support\SignedCall;
use App\Support\StackTransaction;
use App\Support\StartStacks;
use App\Support\Storage\FrameRecord;
use App\Values\RuntimeIntent;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskStatus;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Hooks\InMemoryTasks;
use Tests\Fixtures\Hooks\InMemoryTaskState;
use Tests\Fixtures\Hooks\ListedCommandParser;
use Tests\Fixtures\Hooks\MessageState;
use Tests\Fixtures\Hooks\RewriteState;
use Tests\Fixtures\Hooks\ScriptedState;

/**
 * Hook tests that commit real rows on the hook database: no wrapping transaction, every committed table emptied before
 * and after each test, the test state types, and a started stack for agent 1, session 10.
 */
trait CommittedHookStack
{
    use RefreshHookDatabase;
    use RegistersTestStates;

    protected InMemoryTasks $tasks;

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
        $this->tasks = new InMemoryTasks([
            42 => TaskStatus::Started,
            43 => TaskStatus::Started,
        ]);
        $this->app->instance(InMemoryTasks::class, $this->tasks);
        $this->app->scoped(ShellCommandParser::class, fn () => new ListedCommandParser());
        $this->registerTestState('test.tasks', InMemoryTaskState::class);
        $this->registerTestState('guide', ScriptedState::class);
        $this->makeStatesWith(ScriptedState::class, fn () => ScriptedState::passing());
        $this->registerTestState('test.messaging', MessageState::class);
        $this->registerTestState('test.rewriting', RewriteState::class);
        $this->journal->actAsAgentOf($this->target);
        $this->app->make(StackTransaction::class)->run(
            fn () => $this->app->make(StartStacks::class)->open($this->target),
        );
        $this->journal->installProfiles();
    }

    /**
     * Agent 1 with its active session 10, as rows, so a command that resolves the session finds it; a row a test left
     * behind is reused.
     */
    private function startedTarget(): StackTarget
    {
        $agent = Agent::query()->find(TestIds::of(1)) ?? new Agent()->forceFill(
            [
                'name' => 'Hook agent',
                'profile_key' => 'main-agent',
                'project_id' => TestProjects::local()->id,
            ],
        );
        $agent->id = TestIds::of(1);
        $agent->save();

        $actor = ActorIdentity::of($agent);

        if (! Inbox::query()->personalTo($actor)->exists()) {
            $this->app->make(ActorProvisioning::class)->provision($actor, $agent->name);
        }

        $session = AgentSession::query()->find(TestIds::of(10))
            ?? new AgentSession()->forceFill(TestSelections::sessionColumns());
        $session->id = TestIds::of(10);
        $session->agent_id = $agent->id;
        $session->save();

        return new StackTarget($agent->id, $session->id);
    }

    /**
     * The rewriting state, which runs another line in place of each line it knows.
     */
    protected function rewriting(): StateReference
    {
        return new StateReference('test.rewriting', NoSubject::None, [
            'replacements' => [
                'composer test' => 'git status',
                'make docs' => 'acme publish --docs',
            ],
        ]);
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
            DriverType::Headless,
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
     * What the started agent's program is told when it asks to stop, answered through the journal.
     */
    protected function answerStop(): string
    {
        $answer = $this->journal->answerHook($this->target, $this->stop(), $this->capabilities());

        return DriverReplies::stop($answer, $this->app->make(AgentTexts::class))->stdout;
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

    protected function task(int $number): StateReference
    {
        return new StateReference('test.tasks', new SubjectReference((string) $number, 1), [
            'number' => $number,
            'runNumber' => 1,
        ]);
    }

    protected function machine(): AgentStateMachine
    {
        return $this->app->make(AgentStateMachine::class);
    }

    protected function capabilities(RewriteSupport $rewrites = RewriteSupport::WithoutApproval): DriverCapabilities
    {
        return new DriverCapabilities(
            'Test driver',
            'pre-tool, post-tool and stop replies',
            [
                'onShellCommand',
                'onToolFinished',
                'onStop',
            ],
            $rewrites,
        );
    }

    protected function stop(): StopRequested
    {
        return new StopRequested($this->hookIdentity(), new StopDetails('turn-1', false, ''));
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
            'session_tokens',
            'reported_bypasses',
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
