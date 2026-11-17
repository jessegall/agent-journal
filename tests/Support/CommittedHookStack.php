<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Core\AgentRequests\Support\SignedCall;
use App\Core\Agents\Support\AgentContext;
use App\Core\Agents\Support\StackTarget;
use App\Core\Hooks\Actions\AgentStacks;
use App\Core\Hooks\Actions\LaunchStacks;
use App\Core\Hooks\Contracts\ShellCommandParser;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\Decisions\SubjectReference;
use App\Core\Hooks\Enums\NoSubject;
use App\Core\Hooks\Enums\ReadyStateType;
use App\Core\Hooks\Enums\RewriteSupport;
use App\Core\Hooks\Enums\ShellDialect;
use App\Core\Hooks\Events\StateTypesRequested;
use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Inputs\ShellCommandRequested;
use App\Core\Hooks\Inputs\StopDetails;
use App\Core\Hooks\Inputs\StopRequested;
use App\Core\Hooks\Models\AgentStackRow;
use App\Core\Hooks\Programs\ProgramCapabilities;
use App\Core\Hooks\Programs\ProgramReplies;
use App\Core\Hooks\Stack\AgentStateMachine;
use App\Core\Hooks\Stack\HookAnswer;
use App\Core\Hooks\Storage\FrameRecord;
use App\Core\Hooks\Support\OperationDeadline;
use App\Core\Hooks\Support\StackTransaction;
use App\Domain\Tasks\Enums\TaskWorkState;
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

    protected function callAs(string $callId, string|null $inputDigest = null): void
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
        return ['agent_stacks', 'hook_calls', 'links', 'tasks', 'messages', 'sequence_runs', 'memories', 'memory_compactions', 'rules', 'users', 'agents', 'agent_sessions', 'launch_credentials', 'launch_bypasses', 'command_aliases'];
    }

    private function hookIdentity(): HookIdentity
    {
        return new HookIdentity(1, 10, 'call-1', self::inputDigest());
    }
}
