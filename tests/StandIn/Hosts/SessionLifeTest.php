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
use Closure;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsAgainstStandIn;
use Tests\Support\Hosts\EchoProgramDriver;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A session's whole life through host protocol 1, on the real host against the Docker stand-in: it starts, takes a
 * message and answers it, survives its host's restart without a second paste, is healed after a crash and stops with
 * one exit report (rule 83).
 */
#[TestsAgainstStandIn]
#[TimeLimit(seconds: 60, reason: 'It runs the real host, the Docker stand-in and a served journal.')]
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
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'inboxes',
        'inbox_members',
        'links',
        'users',
    ];

    public function test_a_session_starts_answers_survives_a_host_restart_and_stops(): void
    {
        [$process, $answered] = $this->startEchoSession();

        $work = $this->journal->driveHostProcess('echo', $answered);
        $this->journal->restartRealHost();
        $this->journal->driveHostProcess('echo', fn () => $this->ordersOf(HostOrderType::Snapshot) >= 2);
        $this->journal->asSystem(new StopHostProcessCommand($process, 1000, 1000, HostOrderSource::fromJournal()));

        $this->journal
            ->waitForHostProcess('echo', HostProcessStatus::Exited)
            ->assertResult([1, true], [$this->ordersOf(HostOrderType::WriteKeys), $work->generation >= 1]);
    }

    public function test_a_worker_that_dies_after_ordering_the_paste_is_replaced_without_a_second_paste(): void
    {
        [$process, $answered] = $this->startEchoSession();
        $this->journal->driveHostProcess('echo', fn () => $this->ordersOf(HostOrderType::WriteKeys) === 1);

        $replacement = $this->journal->driveHostProcess('echo', $answered);

        $this->journal->assertResult(
            [1, 2],
            [$this->ordersOf(HostOrderType::WriteKeys), $replacement->generation],
        );
        $this->assertSame($process, $this->journal->hostProcessCalled('echo')->id);
    }

    public function test_a_journal_that_dies_mid_delivery_has_the_message_typed_and_answered_once_it_is_back(): void
    {
        [$process, $answered] = $this->startEchoSession();
        $work = $this->journal->driveHostProcess('echo', fn () => $this->ordersOf(HostOrderType::WriteKeys) === 1);

        $this->journal->restartJournalOfRealHost();
        $this->journal->driveHostProcess('echo', $answered, $work, HostOrder::CLAIM_SECONDS * 2);

        $rows = $this->journal->service(ProcessFeed::class)->latestFrame($process)?->rows ?? [];
        $this->journal->assertResult(1, count(array_keys($rows, 'echo: hello', true)));
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

    /**
     * The echo program runs on the real host for a runtime whose first message is hello; the closure answers whether
     * its reply shows.
     *
     * @return array{string, Closure(): bool}
     */
    private function startEchoSession(): array
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

        return [$process, fn () => in_array('echo: hello', $feed->latestFrame($process)?->rows ?? [], true)];
    }

    private function ordersOf(HostOrderType $type): int
    {
        return count(array_filter(
            $this->journal->hostOrdersOf('echo'),
            fn (HostOrder $order) => $order->type === $type,
        ));
    }
}
