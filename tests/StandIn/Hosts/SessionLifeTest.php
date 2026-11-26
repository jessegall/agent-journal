<?php

declare(strict_types=1);

namespace Tests\StandIn\Hosts;

use App\Commands\Hosts\SendHostKeys\SendHostKeysCommand;
use App\Commands\Hosts\StopHostProcess\StopHostProcessCommand;
use App\Enums\Drivers\DriverType;
use App\Enums\Drivers\RequestProgress;
use App\Enums\Hosts\HostOrderStatus;
use App\Enums\Hosts\HostOrderType;
use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessStatus;
use App\Enums\Hosts\RestartPolicy;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Hosts\HostOrder;
use App\Support\Drivers\DriverWork;
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

    /**
     * How long a screen holds still before a test types on it.
     */
    private const int STILL_MS = 300;

    /**
     * How many times keys a moved screen refused are typed again.
     */
    private const int TYPING_TRIES = 5;

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

    public function test_a_claude_code_terminal_driven_by_the_journal_answers_its_message_and_stops(): void
    {
        $this->openAnsweredTerminal();

        $this->journal->asSystem(new StopHostProcessCommand(
            $this->journal->hostProcessCalled('terminal')->id,
            1000,
            1000,
            HostOrderSource::fromJournal(),
        ));

        $this->journal->waitForHostProcess('terminal', HostProcessStatus::Exited);
        $this->journal->assertResult(1, count($this->journal->realHostClaudeStarts()));
    }

    public function test_a_claude_code_terminal_ends_with_its_hosts_restart_as_its_terminal_is_the_hosts(): void
    {
        $this->openAnsweredTerminal();

        $this->journal->restartRealHost()->waitForHostProcess('terminal', HostProcessStatus::Lost);

        $this->journal->assertResult(1, count($this->journal->realHostClaudeStarts()));
    }

    public function test_a_crashed_claude_code_terminal_starts_its_conversation_again_until_its_transcript_exists(): void
    {
        $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Terminal')
            ->enrollHost('Mac', [base_path()])
            ->runRealHost('Mac')
            ->chooseActiveAccountsOnRealHost();
        $opened = $this->journal->openRuntimeOn('Terminal', 'Mac', base_path(), driverType: DriverType::Terminal);
        $healed = fn (int $times) => fn () => $this->journal->hostProcessCalled('terminal')->generation >= $times
            && count($this->journal->realHostClaudeStarts()) > $times;

        $work = $this->journal->proveStartOnRealHost($opened->runtimeId, HostProcessPurpose::AgentTerminal, 'terminal')
            ->driveHostProcess('terminal', $this->isComposerShown(...));
        $this->typeTaken('crash', $work, $healed(1));
        $this->journal->driveHostProcess('terminal', $healed(1), $work);
        $this->journal->driveHostProcess('terminal', $this->isComposerShown(...), $work);
        $answered = fn () => in_array(
            'done',
            array_map(trim(...), $this->journal->hostProcessRows('terminal')),
            true,
        );
        $this->typeTaken("\e[200~hello\e[201~\r", $work, $answered);
        $this->journal->driveHostProcess('terminal', $answered, $work);
        $this->journal->driveHostProcess('terminal', $this->isScreenStill(...), $work);
        $this->typeTaken('crash', $work, $healed(2));
        $this->journal->driveHostProcess('terminal', $healed(2), $work);

        $this->journal->assertResult(
            ['--session-id', '--session-id', '--resume'],
            array_map(
                fn (array $arguments) => in_array('--resume', $arguments, true) ? '--resume' : '--session-id',
                $this->journal->realHostClaudeStarts(),
            ),
        );
    }

    public function test_keys_sent_from_the_journal_reach_a_terminal_program_byte_for_byte_and_show_on_its_screen(): void
    {
        // Each key with what the screen shows once it arrived: an arrow and Enter draw no new text.
        $sent = [
            'hello' => 'keys> hello',
            "\e[B" => 'keys> hello',
            "\e[200~a pasted line\e[201~" => 'keys> helloa pasted line',
            "\r" => 'keys> helloa pasted line',
            'done' => 'done',
        ];
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, EchoProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->runRealHost('Mac')
            ->openKeyRecorder('Mac', 'keys')
            ->waitForHostProcess('keys', HostProcessStatus::Running);
        $shows = fn (string $text) => fn () => str_contains(implode("\n", $this->journal->hostProcessRows('keys')), $text);
        $work = $this->journal->driveHostProcess('keys', $shows('keys>'));

        foreach ($sent as $keys => $screen) {
            $arrived = fn () => str_ends_with($this->journal->keysRecordedBy('keys'), $keys) && $shows($screen)();
            $this->journal->typeOnHostProcess('keys', $keys)->driveHostProcess('keys', $arrived, $work);
        }

        $shown = array_slice(array_map(rtrim(...), $this->journal->hostProcessRows('keys')), 0, 2);
        $this->journal->assertResult(
            [implode('', array_keys($sent)), ['keys> helloa pasted line', 'done']],
            [$this->journal->keysRecordedBy('keys'), $shown],
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

        $this->journal->proveStartOnRealHost($opened->runtimeId, HostProcessPurpose::AgentTurn, 'turn')
            ->driveHostProcess('turn', fn () => $this->journal->hostProcessCalled('turn')->output_offset > 0);

        return $opened;
    }

    /**
     * A Claude Code terminal on the real host, its start proven by the journal and its first message answered.
     */
    private function openAnsweredTerminal(): void
    {
        $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Terminal')
            ->enrollHost('Mac', [base_path()])
            ->runRealHost('Mac')
            ->chooseActiveAccountsOnRealHost();
        $opened = $this->journal->openRuntimeOn(
            'Terminal',
            'Mac',
            base_path(),
            driverType: DriverType::Terminal,
            firstMessage: 'Count slowly from 1 to 300, then say done.',
        );
        $answered = fn () => in_array('done', array_map(trim(...), $this->journal->hostProcessRows('terminal')), true);

        $this->journal->proveStartOnRealHost($opened->runtimeId, HostProcessPurpose::AgentTerminal, 'terminal')
            ->driveHostProcess('terminal', $answered, seconds: 20);
    }

    /**
     * Types the keys on the terminal until its host takes them or what they do shows: keys guarded by a screen that
     * moved before they arrived are refused, and typed again once the screen holds still.
     */
    private function typeTaken(string $keys, DriverWork $work, Closure $isDone): void
    {
        foreach (range(1, self::TYPING_TRIES) as $try) {
            // Taken once the host says so, or once what the keys do shows.
            $isTaken = fn () => $this->lastKeysOrder()->status === HostOrderStatus::Done || $isDone();
            $isAnswered = fn () => $isTaken() || $this->lastKeysOrder()->status === HostOrderStatus::Refused;
            $this->journal->typeOnHostProcess('terminal', $keys)->driveHostProcess('terminal', $isAnswered, $work);

            if ($isTaken()) {
                return;
            }

            $this->journal->driveHostProcess('terminal', $this->isScreenStill(...), $work);
        }
    }

    private function lastKeysOrder(): HostOrder
    {
        $keys = array_filter(
            $this->journal->hostOrdersOf('terminal'),
            fn (HostOrder $order) => $order->type === HostOrderType::WriteKeys,
        );

        return $keys[array_key_last($keys)];
    }

    /**
     * Whether the Claude Code stand-in drew its ready composer and its screen held still since, so keys guarded by the
     * screen the host last sent land on that screen.
     */
    private function isComposerShown(): bool
    {
        return $this->isScreenStill() && str_contains(implode("\n", $this->journal->hostProcessRows('terminal')), 'Try "');
    }

    /**
     * Whether the screen the terminal's host last sent held still for a while.
     */
    private function isScreenStill(): bool
    {
        $frame = $this->journal->service(ProcessFeed::class)
            ->latestFrame($this->journal->hostProcessCalled('terminal')->id);

        return $frame !== null && min($frame->unchangedMs) >= self::STILL_MS;
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
            ->showDriverArrangements()
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
