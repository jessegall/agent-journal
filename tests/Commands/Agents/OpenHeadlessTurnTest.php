<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\ChangeAgentModel\ChangeAgentModelCommand;
use App\Agents\Commands\CheckSignIn\CheckSignInCommand;
use App\Agents\Commands\DeliverAgent\DeliverAgentCommand;
use App\Agents\Commands\OpenHeadlessTurn\OpenHeadlessTurnCommand;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Hosts\Commands\NotifyHostInventory\NotifyHostInventoryCommand;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Protocol\HostProcessReportType;
use App\Hosts\Protocol\Payloads\HostInventoryPayload;
use App\Messages\Data\MessageTextData;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Hosts\HostProcess;
use App\Processes\Enums\RuntimeActivity;
use App\Sessions\OpenedRuntime;
use Carbon\CarbonImmutable;
use Tests\Support\Agents\TestAgent;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
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
        'session_processes', 'session_requests', 'inboxes', 'inbox_members', 'links', 'users',
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
