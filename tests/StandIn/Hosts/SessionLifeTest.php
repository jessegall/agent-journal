<?php

declare(strict_types=1);

namespace Tests\StandIn\Hosts;

use App\Agents\Commands\InterruptAgent\InterruptAgentCommand;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Drivers\Enums\HoldReason;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Agents\Drivers\Work\DriverWork;
use App\Hosts\Commands\SendHostKeys\SendHostKeysCommand;
use App\Hosts\Commands\StopHostProcess\StopHostProcessCommand;
use App\Hosts\Enums\HostOrderStatus;
use App\Hosts\Enums\HostOrderType;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\ProcessFeed;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Hosts\HostOrder;
use App\Sessions\OpenedRuntime;
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
 * A session's whole life through host protocol 1 against the Docker stand-in: it starts, answers a message, survives a
 * host restart without a second paste, is healed after a crash and stops with one exit report; a headless turn held
 * across a host restart finishes with its whole output once.
 */
#[TestsAgainstStandIn]
#[TimeLimit(seconds: 60, reason: 'It runs the test host, the Docker stand-in and a served journal.')]
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

    /**
     * The thread the recorded Codex exec turn started, which the turn's request is bound to.
     */
    private const string CODEX_THREAD = '01a1eea7-3f30-73b0-909d-32c186306641';

    /**
     * The row of the recorded Codex terminal that shows it took the first message.
     */
    private const string CODEX_ANSWER = '• I’ll run ls, then write a 600-word essay about terminals.';

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
        $this->journal->restartTestHost();
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

        $this->journal->restartJournalOfTestHost();
        $this->journal->driveHostProcess('echo', $answered, $work, HostOrder::CLAIM_SECONDS * 2);

        $rows = $this->journal->service(ProcessFeed::class)->latestFrame($process)?->rows ?? [];
        $this->journal->assertResult(1, count(array_keys($rows, 'echo: hello', true)));
    }

    public function test_a_crashed_container_healed_on_a_crash_runs_again(): void
    {
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, EchoProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac')
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
        $this->journal->assertResult(1, count($this->journal->testHostClaudeStarts()));
    }

    public function test_a_claude_code_terminal_lost_with_its_hosts_restart_is_opened_again_resuming_its_conversation(): void
    {
        $runtimeId = $this->openAnsweredTerminal();

        $this->journal->restartTestHost()->waitForHostProcess('terminal', HostProcessStatus::Lost);
        $this->journal->callJournalProcess('again', $runtimeId, HostProcessPurpose::AgentTerminal)
            ->waitForHostProcess('again', HostProcessStatus::Running);
        $this->journal->driveHostProcess('again', fn () => $this->isComposerShownOn('again'));

        $this->journal->assertResult(
            ['--session-id', '--resume'],
            array_map(
                fn (array $arguments) => in_array('--resume', $arguments, true) ? '--resume' : '--session-id',
                $this->journal->testHostClaudeStarts(),
            ),
        );
    }

    public function test_a_codex_terminal_driven_by_the_journal_answers_its_message_and_stops(): void
    {
        $this->arrangeTerminalHost();
        $this->answerTerminal('Codex', 'codex', 'codex', '0.165.0', 'gpt-5.5', self::CODEX_ANSWER);

        $this->journal->asSystem(new StopHostProcessCommand(
            $this->journal->hostProcessCalled('codex')->id,
            1000,
            1000,
            HostOrderSource::fromJournal(),
        ));

        $this->journal->waitForHostProcess('codex', HostProcessStatus::Exited);
        $this->journal->assertResult([1, []], [count($this->journal->testHostCodexStarts()), $this->journal->testHostClaudeStarts()]);
    }

    public function test_an_interrupt_presses_escape_on_a_running_claude_code_and_codex_turn_and_holds_each(): void
    {
        $this->arrangeTerminalHost();
        $claude = $this->interruptRunningTurn('Terminal', 'terminal', $this->openTerminal('Terminal', 'terminal', 'claude-code', '2.1.323', 'claude-opus-5-5'));
        $codex = $this->interruptRunningTurn('Codex', 'codex', $this->openTerminal('Codex', 'codex', 'codex', '0.165.0', 'gpt-5.5'));

        $this->journal->assertResult([HoldReason::Interrupted, HoldReason::Interrupted], [$claude->hold_reason, $codex->hold_reason]);
    }

    public function test_a_codex_exec_turn_is_opened_driven_and_finished_with_its_thread_bound(): void
    {
        $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Exec')
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac')
            ->chooseActiveAccountsOnTestHost();
        $opened = $this->journal->openRuntimeOn(
            'Exec',
            'Mac',
            base_path(),
            driver: 'codex',
            build: '0.165.0',
            profile: 'codex',
            model: 'gpt-5.5',
            firstMessage: 'Run: ls.',
        );

        $applied = fn () => $this->progressOf($opened->firstRequestId) === RequestProgress::Applied;
        $this->journal->proveStartOnTestHost($opened->runtimeId, HostProcessPurpose::AgentTurn, 'turn')
            ->driveHostProcess('turn', $applied);

        $this->journal->assertResult(
            [HostProcessStatus::Exited, self::CODEX_THREAD, self::CODEX_THREAD],
            [
                $this->journal->hostProcessCalled('turn')->status,
                $this->bindingOf($opened->firstRequestId),
                AgentRuntime::query()->whereKey($opened->runtimeId)->sole()->conversation_id,
            ],
        );
    }

    public function test_a_claude_code_and_a_codex_terminal_lost_with_their_hosts_restart_are_both_opened_again(): void
    {
        $this->arrangeTerminalHost();
        $claude = $this->answerTerminal('Terminal', 'terminal', 'claude-code', '2.1.323', 'claude-opus-5-5', 'done');
        $codex = $this->answerTerminal('Codex', 'codex', 'codex', '0.165.0', 'gpt-5.5', self::CODEX_ANSWER);

        $this->journal->restartTestHost()
            ->waitForHostProcess('terminal', HostProcessStatus::Lost)
            ->waitForHostProcess('codex', HostProcessStatus::Lost);
        $this->journal->callJournalProcess('again', $claude, HostProcessPurpose::AgentTerminal)
            ->callJournalProcess('codex again', $codex, HostProcessPurpose::AgentTerminal)
            ->waitForHostProcess('again', HostProcessStatus::Running)
            ->waitForHostProcess('codex again', HostProcessStatus::Running);

        $this->journal->assertResult(
            [2, 2, true],
            [
                count($this->journal->testHostClaudeStarts()),
                count($this->journal->testHostCodexStarts()),
                in_array('--resume', $this->journal->testHostClaudeStarts()[1], true),
            ],
        );
    }

    public function test_a_crashed_claude_code_terminal_starts_its_conversation_again_until_its_transcript_exists(): void
    {
        $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Terminal')
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac')
            ->chooseActiveAccountsOnTestHost();
        $opened = $this->journal->openRuntimeOn('Terminal', 'Mac', base_path(), driverType: DriverType::Terminal);
        $healed = fn (int $times) => fn () => $this->journal->hostProcessCalled('terminal')->generation >= $times
            && count($this->journal->testHostClaudeStarts()) > $times;

        $work = $this->journal->proveStartOnTestHost($opened->runtimeId, HostProcessPurpose::AgentTerminal, 'terminal')
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
                $this->journal->testHostClaudeStarts(),
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
            ->runTestHost('Mac')
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

        $this->journal->restartTestHost()->releaseStandInTurns();
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
     * A headless Claude agent on the test host with its stand-in, its first message held in its first turn after the
     * turn's first lines: the journal proved the build and the sign-in through their probes and opened the turn.
     */
    private function openHeadlessTurn(string $message): OpenedRuntime
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Driven')
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac')
            ->holdStandInTurns();
        $opened = $this->journal->openRuntimeOn('Driven', 'Mac', base_path(), firstMessage: $message);

        $this->journal->proveStartOnTestHost($opened->runtimeId, HostProcessPurpose::AgentTurn, 'turn')
            ->driveHostProcess('turn', fn () => $this->journal->hostProcessCalled('turn')->output_offset > 0);

        return $opened;
    }

    /**
     * A Claude Code terminal on the test host, its start proven by the journal and its first message answered.
     */
    private function openAnsweredTerminal(): string
    {
        $this->arrangeTerminalHost();

        return $this->answerTerminal('Terminal', 'terminal', 'claude-code', '2.1.323', 'claude-opus-5-5', 'done');
    }

    /**
     * The test host runs for a Claude Code and a Codex agent, with an account of each in the host's own folders.
     */
    private function arrangeTerminalHost(): void
    {
        $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Terminal')
            ->idleAgent('Codex')
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac')
            ->chooseActiveAccountsOnTestHost();
    }

    /**
     * Opens the agent's terminal of the driver, proves its start and drives it until a row of its screen is the
     * answer; the runtime's id.
     */
    private function answerTerminal(
        string $agent,
        string $name,
        string $driver,
        string $build,
        string|null $model,
        string $answer,
    ): string {
        $opened = $this->openTerminal($agent, $name, $driver, $build, $model);
        $answered = fn () => in_array($answer, array_map(trim(...), $this->journal->hostProcessRows($name)), true);

        $this->journal->driveHostProcess($name, $answered, seconds: 20);

        return $opened->runtimeId;
    }

    /**
     * Opens the agent's terminal of the driver with its first message and proves its start; the turn is running.
     */
    private function openTerminal(string $agent, string $name, string $driver, string $build, string|null $model): OpenedRuntime
    {
        $opened = $this->journal->openRuntimeOn(
            $agent,
            'Mac',
            base_path(),
            driver: $driver,
            build: $build,
            profile: $driver === 'codex' ? 'codex' : 'claude',
            driverType: DriverType::Terminal,
            model: $model,
            firstMessage: $driver === 'codex'
                ? 'Run the shell command: ls. Then write a 600 word essay about terminals.'
                : 'Count slowly from 1 to 300, then say done.',
        );
        $this->journal->proveStartOnTestHost($opened->runtimeId, HostProcessPurpose::AgentTerminal, $name);

        return $opened;
    }

    /**
     * Interrupts the agent while its terminal's turn runs: the journal presses Escape on it and holds the runtime.
     */
    private function interruptRunningTurn(string $agent, string $name, OpenedRuntime $opened): AgentRuntime
    {
        $isTurning = fn () => $this->journal->hostProcessCalled($name)->output_offset > 0;
        $work = $this->journal->driveHostProcess($name, $isTurning);
        $this->journal->asOwner(new InterruptAgentCommand($this->journal->agentCalled($agent)->id, $opened->sessionId, "interrupt-{$name}"));
        $escaped = fn () => array_filter(
            $this->journal->hostOrdersOf($name),
            fn (HostOrder $order) => $order->type === HostOrderType::WriteKeys
                && $order->status === HostOrderStatus::Done
                && str_contains($order->kept_payload, '\\u001b'),
        ) !== [];
        $this->journal->driveHostProcess($name, $escaped, $work);

        return AgentRuntime::query()->findOrFail($opened->runtimeId);
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
        return $this->isComposerShownOn('terminal');
    }

    private function isComposerShownOn(string $name): bool
    {
        return $this->isScreenStill($name) && str_contains(implode("\n", $this->journal->hostProcessRows($name)), 'Try "');
    }

    /**
     * Whether the screen the named terminal's host last sent held still for a while.
     */
    private function isScreenStill(string $name = 'terminal'): bool
    {
        $frame = $this->journal->service(ProcessFeed::class)
            ->latestFrame($this->journal->hostProcessCalled($name)->id);

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
     * The echo program runs on the test host for a runtime whose first message is hello; the closure answers whether
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
            ->runTestHost('Mac');
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
