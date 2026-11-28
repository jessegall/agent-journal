<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Drivers\Commands\RecordOwnTerminal\RecordOwnTerminalCommand;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\SessionProcessStatus;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Protocol\HostProcessType;
use App\Models\Hosts\HostProcess;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

#[TestsCommand(RecordOwnTerminalCommand::class)]
final class RecordOwnTerminalTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_runtime_has_one_ordered_terminal_for_its_claimed_start(): void
    {
        $opened = $this->journal->owner()
            ->showDriverArrangements()
            ->chooseActiveAccounts()
            ->enrollHost('Mac', [base_path()])
            ->idleAgent('Driven')
            ->withAgent('Driven', fn (TestAgent $agent) => $agent
                ->openRuntime('Mac', base_path(), driverType: DriverType::ofOwnTerminal()))
            ->openedRuntimeOf('Driven');

        $record = new RecordOwnTerminalCommand($opened->runtimeId);
        $terminal = $this->journal->asSystem($record);
        $retry = $this->journal->asSystem($record);

        $process = HostProcess::query()->findOrFail($terminal->processId);
        $start = $this->journal->startOfSession($opened->sessionId);
        $this->journal->assertResult(
            [
                $retry->processId,
                HostProcessPurpose::AgentTerminal,
                HostProcessType::Terminal,
                HostProcessStatus::Ordered,
                $start->id,
                $start->host_id,
                SessionProcessStatus::Starting,
            ],
            [
                $process->id,
                $process->purpose,
                $process->type,
                $process->status,
                $process->session_process_id,
                $process->host_id,
                $start->status,
            ],
        );
    }
}
