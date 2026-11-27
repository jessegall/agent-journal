<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\OpenHeadlessStart\OpenHeadlessStartCommand;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\SessionProcessStatus;
use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostProcess;
use Tests\Support\Agents\TestAgent;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A headless Claude Code start is taken by the journal itself once it is registered: claimed for its runtime's host,
 * its conversation chosen and its build probe ordered, with no host call; a terminal start is left to its host, and a
 * start taken already is not taken twice.
 */
#[TestsCommand(OpenHeadlessStartCommand::class)]
final class OpenHeadlessStartTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'hosts', 'host_processes', 'host_orders', 'agents', 'agent_sessions', 'session_tokens', 'agent_stacks',
        'hook_calls', 'agent_runtimes', 'driver_requests', 'driver_turns', 'accounts', 'active_accounts',
        'session_processes', 'session_requests', 'inboxes', 'inbox_members', 'links', 'users',
    ];

    public function test_a_headless_start_is_claimed_its_conversation_chosen_and_its_build_probed(): void
    {
        $this->journal
            ->owner()
            ->chooseActiveAccounts()
            ->showDriverArrangements()
            ->idleAgent('Driven')
            ->enrollHost('Mac', [base_path()]);

        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven->openRuntime('Mac', base_path()));
        $opened = $this->journal->openedRuntimeOf('Driven');

        $start = $this->journal->startOfSession($opened->sessionId);
        $probe = HostProcess::query()->where('session_process_id', $start->id)->sole();
        $runtime = AgentRuntime::query()->whereKey($opened->runtimeId)->sole();
        $this->journal->assertResult(
            [
                SessionProcessStatus::Starting,
                $this->journal->hostCalled('Mac')->hostId,
                true,
                HostProcessPurpose::BuildProbe,
            ],
            [$start->status, $start->host_id, $runtime->conversation_id !== null, $probe->purpose],
        );
        $this->journal->assertResult(null, $this->journal->asSystem(new OpenHeadlessStartCommand($opened->sessionId)));
    }

    public function test_a_claude_terminal_start_is_claimed_and_probed_by_the_journal_too(): void
    {
        $this->journal
            ->owner()
            ->chooseActiveAccounts()
            ->showDriverArrangements()
            ->idleAgent('Driven')
            ->enrollHost('Mac', [base_path()]);

        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->openRuntime('Mac', base_path(), driverType: DriverType::Terminal));
        $opened = $this->journal->openedRuntimeOf('Driven');

        $start = $this->journal->startOfSession($opened->sessionId);
        $this->journal->assertResult(
            [SessionProcessStatus::Starting, HostProcessPurpose::BuildProbe],
            [$start->status, HostProcess::query()->where('session_process_id', $start->id)->sole()->purpose],
        );
    }
}
