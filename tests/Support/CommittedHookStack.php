<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Domain\Agents\AgentContext;
use App\Domain\Agents\SignedCall;
use App\Domain\Hooks\AgentStacks;
use App\Domain\Hooks\AgentStateMachine;
use App\Domain\Hooks\Decisions\NoSubject;
use App\Domain\Hooks\Decisions\StateReference;
use App\Domain\Hooks\Decisions\SubjectReference;
use App\Domain\Hooks\Events\StateTypesRequested;
use App\Domain\Hooks\Inputs\HookIdentity;
use App\Domain\Hooks\Inputs\ShellCommandParser;
use App\Domain\Hooks\Inputs\ShellCommandRequested;
use App\Domain\Hooks\Inputs\ShellDialect;
use App\Domain\Hooks\Inputs\StopDetails;
use App\Domain\Hooks\Inputs\StopRequested;
use App\Domain\Hooks\LaunchStacks;
use App\Domain\Hooks\Models\AgentStackRow;
use App\Domain\Hooks\OperationDeadline;
use App\Domain\Hooks\Programs\ProgramCapabilities;
use App\Domain\Hooks\Programs\ProgramReplies;
use App\Domain\Hooks\Programs\RewriteSupport;
use App\Domain\Hooks\Stack\HookAnswer;
use App\Domain\Hooks\StackTransaction;
use App\Domain\Hooks\States\ReadyStateType;
use App\Domain\Hooks\Storage\FrameRecord;
use App\Domain\Hooks\Storage\StackTarget;
use App\Domain\Tasks\TaskWorkState;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Events\Dispatcher;
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
        $this->setUpRefreshHookDatabase();
        $this->emptyTables(...self::committedTables());
        $this->target = new StackTarget(1, 10);
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

    protected function callAs(string $callId, ?string $inputDigest = null): void
    {
        $this->app->instance(AgentContext::class, new AgentContext(1, 10, 'hooks.main_ready', new SignedCall($callId, CarbonImmutable::now(), $inputDigest ?? self::inputDigest())));
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
        return ['agent_stacks', 'hook_calls', 'links', 'tasks', 'messages', 'sequence_runs', 'memories', 'memory_compactions', 'rules', 'users', 'agents', 'agent_sessions', 'launch_credentials', 'launch_bypasses', 'saved_commands'];
    }

    private function hookIdentity(): HookIdentity
    {
        return new HookIdentity(1, 10, 'call-1', self::inputDigest());
    }
}
