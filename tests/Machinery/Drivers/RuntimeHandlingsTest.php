<?php

declare(strict_types=1);

namespace Tests\Machinery\Drivers;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Drivers\Contracts\RuntimeHandling;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Drivers\Handling\HostHandling;
use App\Agents\Drivers\Handling\TerminalHandling;
use App\Agents\Drivers\Handling\TurnHandling;
use App\Agents\Enums\SessionProcessStatus;
use App\Events\Connections\HostProcessExited;
use App\Events\Connections\HostProcessLost;
use App\Hosts\Contracts\HostProcessEndEvent;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Protocol\HostProcessReportType;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostInstruction;
use App\Models\Hosts\HostProcess;
use App\Models\Sessions\SessionProcess;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * Each driver's handling says what the end of one of its processes means for the start it ran for: a turn ends alone,
 * a terminal lost with its host leaves its start for the journal to open again, one that ended stops its start, a
 * process that never ran refuses it, and a host-run driver opens nothing of its own.
 */
#[TestsMachinery(TurnHandling::class)]
#[TestsMachinery(TerminalHandling::class)]
#[TestsMachinery(HostHandling::class)]
final class RuntimeHandlingsTest extends TestCase
{
    use RefreshHookDatabase;
    use WithActiveAccount;

    private const string AGENT = 'Driven';

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
        $this->journal->owner()->showDriverArrangements()->enrollHost('Mac', [base_path()]);
    }

    public function test_a_turns_end_leaves_its_start_running(): void
    {
        [$turn, $start] = $this->ranProcess('turn', HostProcessPurpose::AgentTurn);

        $this->endInsideHost(TurnHandling::class, $turn, $this->exitOf($turn));

        $this->journal->assertResult(SessionProcessStatus::Running, $start->refresh()->status);
    }

    public function test_a_terminal_lost_with_its_host_leaves_its_start_running(): void
    {
        [$terminal, $start] = $this->ranProcess('terminal', HostProcessPurpose::AgentTerminal);

        $this->endInsideHost(TerminalHandling::class, $terminal, $this->lossOf($terminal));

        $this->journal->assertResult(SessionProcessStatus::Running, $start->refresh()->status);
    }

    public function test_a_terminal_that_ended_stops_its_start(): void
    {
        [$terminal, $start] = $this->ranProcess('terminal', HostProcessPurpose::AgentTerminal);

        $this->endInsideHost(TerminalHandling::class, $terminal, $this->exitOf($terminal));

        $this->journal->assertResult(SessionProcessStatus::Stopped, $start->refresh()->status);
    }

    public function test_a_probe_that_never_ran_refuses_its_start_when_the_host_reports_its_loss(): void
    {
        [, $start] = $this->orderedProcess('probe', HostProcessPurpose::BuildProbe);

        $this->journal->hostProcess('probe', fn (TestHostProcess $probe) => $probe->report(HostProcessReportType::Lost));

        $this->journal->assertResult(SessionProcessStatus::Stopped, $start->refresh()->status);
    }

    public function test_a_host_run_driver_opens_nothing_and_is_not_run_by_the_journal(): void
    {
        [, $start] = $this->orderedProcess('agent', HostProcessPurpose::AgentTerminal);
        $runtime = AgentRuntime::query()->findOrFail($this->journal->openedRuntimeOf(self::AGENT)->runtimeId);
        $orders = HostInstruction::query()->count();
        $handling = $this->app->make(HostHandling::class);

        $handling->openStart($runtime);
        $handling->continueAgent($runtime);

        $this->journal->assertResult(
            [false, $orders, SessionProcessStatus::Starting],
            [$handling->isRunByJournal(), HostInstruction::query()->count(), $start->refresh()->status],
        );
    }

    /**
     * A process of the purpose that the host opened for the agent's start and reported running.
     *
     * @return array{HostProcess, SessionProcess}
     */
    private function ranProcess(string $name, HostProcessPurpose $purpose): array
    {
        [, $start] = $this->orderedProcess($name, $purpose);
        $this->journal->hostProcess($name, fn (TestHostProcess $process) => $process
            ->report(HostProcessReportType::Running));

        return [$this->journal->hostProcessCalled($name)->refresh(), $start->refresh()];
    }

    /**
     * A process of the purpose ordered for the agent's start, which the host has not reported yet.
     *
     * @return array{HostProcess, SessionProcess}
     */
    private function orderedProcess(string $name, HostProcessPurpose $purpose): array
    {
        $agent = self::AGENT;
        $this->journal->idleAgent($agent);
        $this->journal->withAgent($agent, fn (TestAgent $driven) => $driven
            ->openRuntime('Mac', base_path(), driverType: DriverType::Terminal));
        $opened = $this->journal->openedRuntimeOf($agent);
        $this->journal->host('Mac', fn (TestEnrolledHost $mac) => $mac
            ->openProcessForStart($name, $opened->sessionId, $purpose));

        return [$this->journal->hostProcessCalled($name), $this->journal->startOfSession($opened->sessionId)];
    }

    /**
     * Ends the process through the handling inside the host's entry, where the fact of its end arrives.
     *
     * @param  class-string<RuntimeHandling>  $handling
     */
    private function endInsideHost(string $handling, HostProcess $process, HostProcessEndEvent $fact): void
    {
        $this->journal->runInside(
            CommandEntry::HostControl,
            fn () => $this->app->make($handling)->endWith($process, $fact),
        );
    }

    private function exitOf(HostProcess $process): HostProcessExited
    {
        return new HostProcessExited($process->id, $process->agent_runtime_id, null, 0, null, 'exited with 0');
    }

    private function lossOf(HostProcess $process): HostProcessLost
    {
        return new HostProcessLost($process->id, $process->agent_runtime_id, null, 'lost with its host');
    }
}
