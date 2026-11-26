<?php

declare(strict_types=1);

namespace Tests\StandIn\Hosts;

use App\Commands\Hosts\SendHostKeys\SendHostKeysCommand;
use App\Commands\Hosts\StopHostProcess\StopHostProcessCommand;
use App\Enums\Hosts\HostOrderType;
use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessStatus;
use App\Enums\Hosts\RestartPolicy;
use App\Models\Hosts\HostOrder;
use App\Support\Hosts\ProcessFeed;
use App\Values\HostOrderSource;
use App\Values\RowGuard;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsAgainstStandIn;
use Tests\Support\Hosts\EchoProgramDriver;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A session's whole life through host protocol 1, on the real host against the Docker stand-in: it starts, takes a
 * message and answers it, survives its host's restart without a second paste, is healed after a crash and stops with
 * one exit report (rule 83).
 */
#[TestsAgainstStandIn]
final class SessionLifeTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'hosts',
        'host_processes',
        'host_orders',
        'agents',
        'agent_sessions',
        'agent_runtimes',
        'driver_requests',
        'session_tokens',
    ];

    public function test_a_session_starts_answers_survives_a_host_restart_and_stops(): void
    {
        $this->chooseActiveAccounts();
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, EchoProgramDriver::class)
            ->owner()
            ->idleAgent('Echo')
            ->enrollHost('Mac', [base_path()])
            ->runRealHost('Mac');
        $opened = $this->journal->openRuntimeOn('Echo', 'Mac', base_path(), firstMessage: 'hello');
        $this->journal
            ->openEchoContainer('Mac', 'echo', $opened->runtimeId)
            ->waitForHostProcess('echo', HostProcessStatus::Running);
        $process = $this->journal->hostProcessCalled('echo')->id;
        $feed = $this->journal->service(ProcessFeed::class);
        $answered = fn () => in_array('echo: hello', $feed->latestFrame($process)?->rows ?? [], true);

        $work = $this->journal->driveHostProcess('echo', $answered);
        $this->journal->restartRealHost();
        $this->journal->driveHostProcess('echo', fn () => $this->ordersOf(HostOrderType::Snapshot) >= 2);
        $this->journal->asSystem(new StopHostProcessCommand($process, 1000, 1000, HostOrderSource::fromJournal()));

        $this->journal
            ->waitForHostProcess('echo', HostProcessStatus::Exited)
            ->assertResult([1, true], [$this->ordersOf(HostOrderType::WriteKeys), $work->generation >= 1]);
    }

    public function test_a_crashed_container_healed_on_a_crash_runs_again(): void
    {
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, EchoProgramDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->runRealHost('Mac')
            ->openEchoContainer('Mac', 'echo', restart: RestartPolicy::OnCrash)
            ->waitForHostProcess('echo', HostProcessStatus::Running);
        $process = $this->journal->hostProcessCalled('echo');
        $feed = $this->journal->service(ProcessFeed::class);
        $work = $this->journal->driveHostProcess('echo', fn () => $feed->latestFrame($process->id) !== null);
        $rows = $feed->latestFrame($process->id)?->rows ?? [];
        $guard = new RowGuard(0, count($rows) - 1, hash('sha256', implode("\n", $rows)));

        $this->journal->asSystem(
            new SendHostKeysCommand($process->id, "crash\r", $guard, 0, HostOrderSource::fromJournal()),
        );

        $this->journal->driveHostProcess('echo', fn () => $this->journal->hostProcessCalled('echo')->generation >= 1, $work);
        $this->journal->assertResult(HostProcessStatus::Running, $this->journal->hostProcessCalled('echo')->status);
    }

    private function ordersOf(HostOrderType $type): int
    {
        return count(array_filter(
            $this->journal->hostOrdersOf('echo'),
            fn (HostOrder $order) => $order->type === $type,
        ));
    }
}
