<?php

declare(strict_types=1);

namespace Tests\StandIn\Hosts;

use App\Commands\Hosts\SendHostKeys\SendHostKeysCommand;
use App\Commands\Hosts\StopHostProcess\StopHostProcessCommand;
use App\Enums\Drivers\DriverType;
use App\Enums\Drivers\RequestProgress;
use App\Enums\Hosts\HostOrderType;
use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessStatus;
use App\Enums\Hosts\RestartPolicy;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
use App\Support\Hosts\ProcessFeed;
use App\Support\OpenedRuntime;
use App\Values\HostOrderSource;
use App\Values\RowGuard;
use Closure;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsAgainstStandIn;
use Tests\Support\Hosts\EchoProcessDriver;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A session's whole life through host protocol 1, on the real host against the Docker stand-in: it starts, takes a
 * message and answers it, survives its host's restart without a second paste, is healed after a crash and stops with
 * one exit report; a headless turn runs from the journal on the installation's stand-in, and one held across
 * its host's restart finishes with its whole output once.
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
        'session_requests',
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
            ->driveProcessesWith(HostProcessPurpose::Probe, EchoProcessDriver::class)
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

        $healed = fn () => $this->journal->hostProcessCalled('echo')->generation >= 1;
        $this->journal->driveHostProcess('echo', $healed, $work);
        $this->journal->assertResult(HostProcessStatus::Running, $this->journal->hostProcessCalled('echo')->status);
    }

    public function test_a_headless_turn_is_opened_driven_and_finished_by_the_journal(): void
    {
        $opened = $this->openHeadlessTurn('Run: ls.');

        $applied = fn () => $this->progressOf($opened->firstRequestId) === RequestProgress::Applied;
        $this->journal->releaseStandInTurns()->driveHostProcess('turn', $applied);

        $conversation = AgentRuntime::query()->whereKey($opened->runtimeId)->sole()->conversation_id;
        $this->journal->assertResult(
            [HostProcessStatus::Exited, $conversation],
            [$this->journal->hostProcessCalled('turn')->status, $this->bindingOf($opened->firstRequestId)],
        );
    }

    public function test_a_headless_turn_held_across_its_hosts_restart_finishes_with_its_result_once(): void
    {
        $opened = $this->openHeadlessTurn('Run: ls.');

        $this->journal->restartRealHost()->releaseStandInTurns();
        $applied = fn () => $this->progressOf($opened->firstRequestId) === RequestProgress::Applied;
        $this->journal->driveHostProcess('turn', $applied);

        $turn = $this->journal->hostProcessCalled('turn')->id;
        $printed = implode('', array_map(
            fn ($entry) => (string) $entry->chunk?->printed(),
            $this->journal->service(ProcessFeed::class)->after($turn, ProcessFeed::FIRST_CURSOR, 0),
        ));
        $recorded = (string) file_get_contents(base_path('tests/Support/Hosts/fixtures/claude-turn.jsonl'));
        $this->journal->assertResult(
            [HostProcessStatus::Exited, $recorded],
            [$this->journal->hostProcessCalled('turn')->status, $printed],
        );
    }

    /**
     * A headless Claude agent on the real host with its stand-in, its first message held in its first turn after the
     * turn's first lines: the journal proved the build and the sign-in through their probes and opened the turn.
     */
    private function openHeadlessTurn(string $message): OpenedRuntime
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Driven')
            ->enrollHost('Mac', [base_path()])
            ->runRealHost('Mac')
            ->holdStandInTurns();
        $opened = $this->journal->openRuntimeOn('Driven', 'Mac', base_path(), firstMessage: $message);

        $signInOrdered = fn () => $this->hasProcess($opened->runtimeId, HostProcessPurpose::SignInProbe);
        $turnOrdered = fn () => $this->hasProcess($opened->runtimeId, HostProcessPurpose::AgentTurn);
        $this->journal->callJournalProcess('probe', $opened->runtimeId, HostProcessPurpose::BuildProbe)
            ->driveHostProcess('probe', $signInOrdered);
        $this->journal->callJournalProcess('sign-in', $opened->runtimeId, HostProcessPurpose::SignInProbe)
            ->driveHostProcess('sign-in', $turnOrdered);
        $this->journal->callJournalProcess('turn', $opened->runtimeId, HostProcessPurpose::AgentTurn)
            ->driveHostProcess('turn', fn () => $this->journal->hostProcessCalled('turn')->output_offset > 0);

        return $opened;
    }

    private function hasProcess(string $runtimeId, HostProcessPurpose $purpose): bool
    {
        return HostProcess::query()->where('agent_runtime_id', $runtimeId)->where('purpose', $purpose)->exists();
    }

    private function progressOf(string|null $requestId): RequestProgress
    {
        return DriverRequest::query()->whereKey($requestId)->sole()->progress;
    }

    private function bindingOf(string|null $requestId): string|null
    {
        return DriverRequest::query()->whereKey($requestId)->sole()->actual_binding;
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
            ->driveProcessesWith(HostProcessPurpose::Probe, EchoProcessDriver::class)
            ->owner()
            ->idleAgent('Echo')
            ->enrollHost('Mac', [base_path()])
            ->runRealHost('Mac');
        $opened = $this->journal->openRuntimeOn(
            'Echo',
            'Mac',
            base_path(),
            driverType: DriverType::Terminal,
            firstMessage: 'hello',
        );
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
