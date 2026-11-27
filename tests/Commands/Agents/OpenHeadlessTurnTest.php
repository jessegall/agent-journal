<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\CheckSignIn\CheckSignInCommand;
use App\Agents\Commands\DeliverAgent\DeliverAgentCommand;
use App\Agents\Commands\OpenHeadlessTurn\OpenHeadlessTurnCommand;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Protocol\HostProcessReportType;
use App\Messages\Data\MessageTextData;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Hosts\HostProcess;
use Tests\Support\Agents\TestAgent;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
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
