<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\AgentContext;
use App\Agents\Support\StackTarget;
use App\Bus\Support\OperationDeadline;
use App\Hooks\Actions\AgentStacks;
use App\Hooks\Actions\LaunchStacks;
use App\Hooks\Contracts\ShellCommandParser;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Enums\ReadyStateType;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Enums\ShellDialect;
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
use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskWorkState;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\ConnectionInterface;
use Tests\Fixtures\Hooks\ClosureStateType;
use Tests\Fixtures\Hooks\InMemoryTaskType;
use Tests\Fixtures\Hooks\ListedCommandParser;
use Tests\Fixtures\Hooks\RewritingState;
use Tests\Fixtures\Hooks\ScriptedState;

/**
 * Hook tests that commit real rows on the hook database: no wrapping transaction, every committed table emptied before
 * and after each test, the test state types, and a launched stack for agent 1, session 10.
 */
trait CommittedHookStack
{
    use RefreshHookDatabase;

    protected InMemoryTaskType $tasks;

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
        $this->target = $this->launchedTarget();
        $this->tasks = new InMemoryTaskType([42 => TaskWorkState::Active, 43 => TaskWorkState::Active]);
        $this->app->instance(ShellCommandParser::class, new ListedCommandParser);
        $tasks = $this->tasks;
        $this->app->make(Dispatcher::class)->listen(StateTypesRequested::class, function (StateTypesRequested $event) use ($tasks): void {
            $event->registry->register('test.tasks', $tasks);
            $event->registry->register('guide', new ClosureStateType(fn () => ScriptedState::delegating()));
            $event->registry->register('test.rewriting', new ClosureStateType(fn () => new RewritingState(
                ['composer test' => 'journal run tests'],
                new StateReference('guide', NoSubject::None),
            )));
        });
        $this->callAs('call-1');
        $this->app->make(StackTransaction::class)->run(fn () => $this->app->make(LaunchStacks::class)->open($this->target, ReadyStateType::MainAgent));
    }

    /**
     * Agent 1 with its active session 10, as rows, so a command that resolves the session finds it; the id sequences
     * go on after them.
     */
    private function launchedTarget(): StackTarget
    {
        $agent = new Agent(['name' => 'Hook agent', 'role' => 'hooks.main_ready']);
        $agent->id = 1;
        $agent->save();
        $session = new AgentSession(['program' => 'claude-code', 'program_session_id' => 'hook-session']);
        $session->id = 10;
        $session->agent_id = $agent->id;
        $session->save();

        $database = $this->app->make(ConnectionInterface::class);
        $database->statement("SELECT setval(pg_get_serial_sequence('agents', 'id'), 1)");
        $database->statement("SELECT setval(pg_get_serial_sequence('agent_sessions', 'id'), 10)");

        return new StackTarget($agent->id, $session->id);
    }

    protected function tearDownCommittedHookStack(): void
    {
        $this->emptyTables(...self::committedTables());
    }

    /**
     * The answer the machine gives a stop from the launched agent under this call id.
     */
    protected function answerStop(string $callId): string
    {
        $this->callAs($callId);

        return $this->machine()->answer($this->stop(), $this->capabilities(), new OperationDeadline(3000), fn (HookAnswer $answer) => ProgramReplies::stop($answer))->stdout;
    }

    protected function callAs(string $callId, string|null $inputDigest = null): void
    {
        $this->app->instance(AgentContext::class, new AgentContext(1, 10, 'hooks.main_ready', new SignedCall($callId, CarbonImmutable::now(), $inputDigest ?? self::inputDigest())));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent(1));
    }

    protected function pushState(StateReference $state): void
    {
        $this->app->make(StackTransaction::class)->run(fn () => $this->app->make(AgentStacks::class)->push($this->target, $state));
    }

    protected function task(int $number): StateReference
    {
        return new StateReference('test.tasks', new SubjectReference($number, 1));
    }

    protected function machine(): AgentStateMachine
    {
        return $this->app->make(AgentStateMachine::class);
    }

    protected function capabilities(RewriteSupport $rewrites = RewriteSupport::WithoutApproval): ProgramCapabilities
    {
        return new ProgramCapabilities('Test program', 'pre-tool and stop replies', ['onShellCommand', 'onStop'], $rewrites);
    }

    protected function stop(): StopRequested
    {
        return new StopRequested($this->hookIdentity(), new StopDetails('turn-1', false));
    }

    protected function shell(string $line): ShellCommandRequested
    {
        return new ShellCommandRequested($this->hookIdentity(), (new ListedCommandParser)->parse($line, ShellDialect::Bash));
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
        return ['agent_stacks', 'hook_calls', 'links', 'tasks', 'messages', 'sequence_runs', 'memories', 'memory_compactions', 'rules', 'users', 'agents', 'agent_sessions', 'launch_credentials', 'launch_bypasses', 'command_aliases'];
    }

    private function hookIdentity(): HookIdentity
    {
        return new HookIdentity(1, 10, 'call-1', self::inputDigest());
    }
}
