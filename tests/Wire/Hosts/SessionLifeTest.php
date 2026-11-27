<?php

declare(strict_types=1);

namespace Tests\Wire\Hosts;

use App\Agents\Commands\InterruptAgent\InterruptAgentCommand;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Drivers\Enums\HoldReason;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Hosts\Commands\StopHostProcess\StopHostProcessCommand;
use App\Hosts\Enums\HostInstructionStatus;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessStatus;
use App\Hosts\Enums\RestartPolicy;
use App\Hosts\ProcessFeed;
use App\Hosts\Protocol\HostInstructionType;
use App\Models\Hosts\HostInstruction;
use App\Processes\Enums\RuntimeActivity;
use App\Values\HostInstructionSource;
use Closure;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Assertions\Assert;
use Tests\Support\Assertions\Facts\HostInstructionFacts;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\OverTheWire;
use Tests\Support\Hosts\EchoProcessDriver;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A session's whole life through host protocol 1 against the Docker mock: it starts, answers a message, survives a
 * host restart without a second paste, is healed after a crash and stops with one exit report; a headless turn held
 * across a host restart finishes with its whole output once.
 */
#[OverTheWire]
#[TimeLimit(seconds: 60, reason: 'It runs the test host, the Docker mock and a served journal.')]
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
     * The row of the recorded Codex terminal that shows it took the first message.
     */
    private const string CODEX_ANSWER = '• I’ll run ls, then write a 600-word essay about terminals.';

    private const array TABLES = [
        'hosts',
        'host_processes',
        'host_instructions',
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
        $this->startEchoSession()
            ->hostProcess('echo', fn (TestHostProcess $echo) => $echo->driveUntil($this->echoed('hello')))
            ->testHost(fn (TestHost $mac) => $mac->restartHost())
            ->hostProcess('echo', fn (TestHostProcess $echo) => $echo
                ->beginWorker()
                ->driveUntil($this->ordered('echo', HostInstructionType::Snapshot, 2)))
            ->asSystem($this->stopOf('echo'));

        $this->journal
            ->hostProcess('echo', fn (TestHostProcess $echo) => $echo->waitFor(HostProcessStatus::Exited))
            ->assertJournal(fn (Assert $journal) => $journal->has('hostProcesses.echo', fn (Assert $echo) => $echo
                ->where('instructionCounts.'.HostInstructionType::WriteKeys->value, 1)
                ->where('workerGeneration', fn (int $generation) => $generation >= 1)
                ->etc()));
    }

    public function test_a_worker_that_dies_after_ordering_the_paste_is_replaced_without_a_second_paste(): void
    {
        $this->startEchoSession()
            ->hostProcess('echo', fn (TestHostProcess $echo) => $echo
                ->driveUntil($this->ordered('echo', HostInstructionType::WriteKeys, 1))
                ->beginWorker()
                ->driveUntil($this->echoed('hello')))
            ->assertJournal(fn (Assert $journal) => $journal->has('hostProcesses.echo', fn (Assert $echo) => $echo
                ->where('instructionCounts.'.HostInstructionType::WriteKeys->value, 1)
                ->where('workerGeneration', 2)
                ->etc()));
    }

    public function test_a_journal_that_dies_mid_delivery_has_the_message_typed_and_answered_once_it_is_back(): void
    {
        $this->startEchoSession()
            ->hostProcess('echo', fn (TestHostProcess $echo) => $echo
                ->driveUntil($this->ordered('echo', HostInstructionType::WriteKeys, 1)))
            ->testHost(fn (TestHost $mac) => $mac->restartJournal())
            ->hostProcess('echo', fn (TestHostProcess $echo) => $echo
                ->driveUntil($this->echoed('hello'), HostInstruction::CLAIM_SECONDS * 2))
            ->assertJournal(fn (Assert $journal) => $journal->where(
                'hostProcesses.echo.rows',
                fn (array $rows) => count(array_keys($rows, 'echo: hello', true)) === 1,
            ));
    }

    public function test_a_crashed_container_healed_on_a_crash_runs_again(): void
    {
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, EchoProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac
                ->openEchoContainer('echo', restart: RestartPolicy::OnCrash)
                ->process('echo', fn (TestHostProcess $echo) => $echo
                    ->waitFor(HostProcessStatus::Running)
                    ->driveUntil(fn (Assert $journal) => $journal->has('hostProcesses.echo.rows'))
                    ->type("crash\r")
                    ->driveUntil(fn (Assert $journal) => $journal->where('hostProcesses.echo.generation', 1))))
            ->assertJournal(fn (Assert $journal) => $journal
                ->where('hostProcesses.echo.status', HostProcessStatus::Running));
    }

    public function test_a_headless_turn_is_opened_driven_and_finished_by_the_journal(): void
    {
        $this->openHeadlessTurn('Run: ls.')
            ->testHost(fn (TestHost $mac) => $mac->releaseTurns())
            ->hostProcess('turn', fn (TestHostProcess $turn) => $turn->driveUntil($this->applied()))
            ->assertJournal(fn (Assert $journal) => $journal
                ->where('hostProcesses.turn.status', HostProcessStatus::Exited)
                ->where(
                    'agents.Driven.runtime.firstRequest.binding',
                    $journal->value('agents.Driven.runtime.conversation'),
                ));
    }

    public function test_a_claude_code_terminal_driven_by_the_journal_answers_its_message_and_stops(): void
    {
        $this->arrangeTerminalHost()
            ->answerTerminal('Terminal', 'terminal', 'claude-code', '2.1.323', 'claude-opus-5-5', 'done')
            ->asSystem($this->stopOf('terminal'));

        $this->journal
            ->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal->waitFor(HostProcessStatus::Exited))
            ->assertJournal(fn (Assert $journal) => $journal->count('testHost.claudeStarts', 1));
    }

    public function test_a_claude_code_terminal_lost_with_its_hosts_restart_is_opened_again_resuming_its_conversation(): void
    {
        $this->arrangeTerminalHost()
            ->answerTerminal('Terminal', 'terminal', 'claude-code', '2.1.323', 'claude-opus-5-5', 'done')
            ->testHost(fn (TestHost $mac) => $mac->restartHost())
            ->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal->waitFor(HostProcessStatus::Lost))
            ->withAgent('Terminal', fn (TestAgent $terminal) => $terminal
                ->nameProcess('again', HostProcessPurpose::AgentTerminal))
            ->hostProcess('again', fn (TestHostProcess $again) => $again
                ->waitFor(HostProcessStatus::Running)
                ->driveUntil($this->composerShownOn('again')))
            ->assertJournal(fn (Assert $journal) => $journal->where(
                'testHost.claudeStarts',
                fn (array $starts) => $this->resumes($starts) === ['--session-id', '--resume'],
            ));
    }

    public function test_a_codex_terminal_driven_by_the_journal_answers_its_message_and_stops(): void
    {
        $this->arrangeTerminalHost()
            ->answerTerminal('Codex', 'codex', 'codex', '0.165.0', 'gpt-5.5', self::CODEX_ANSWER)
            ->asSystem($this->stopOf('codex'));

        $this->journal
            ->hostProcess('codex', fn (TestHostProcess $codex) => $codex->waitFor(HostProcessStatus::Exited))
            ->assertJournal(fn (Assert $journal) => $journal
                ->count('testHost.codexStarts', 1)
                ->count('testHost.claudeStarts', 0));
    }

    public function test_an_interrupt_presses_escape_on_a_running_claude_code_and_codex_turn_and_holds_each(): void
    {
        // The recording in which Claude Code was interrupted during its turn, so its turn still runs when the journal
        // presses Escape.
        $this->arrangeTerminalHost()->journal->testHost(fn (TestHost $mac) => $mac
            ->playClaudeTerminal('terminal-interrupt'));
        $this->openTerminal('Terminal', 'terminal', 'claude-code', '2.1.323', 'claude-opus-5-5')
            ->interruptRunningTurn('Terminal', 'terminal')
            ->openTerminal('Codex', 'codex', 'codex', '0.165.0', 'gpt-5.5')
            ->interruptRunningTurn('Codex', 'codex');

        $this->journal->assertJournal(fn (Assert $journal) => $journal
            ->where('agents.Terminal.runtime.holdReason', HoldReason::Interrupted)
            ->where('agents.Codex.runtime.holdReason', HoldReason::Interrupted));
    }

    public function test_a_claude_code_and_a_codex_terminal_lost_with_their_hosts_restart_are_both_opened_again(): void
    {
        $this->arrangeTerminalHost()
            ->answerTerminal('Terminal', 'terminal', 'claude-code', '2.1.323', 'claude-opus-5-5', 'done');
        $this->answerTerminal('Codex', 'codex', 'codex', '0.165.0', 'gpt-5.5', self::CODEX_ANSWER)
            ->testHost(fn (TestHost $mac) => $mac->restartHost())
            ->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal->waitFor(HostProcessStatus::Lost))
            ->hostProcess('codex', fn (TestHostProcess $codex) => $codex->waitFor(HostProcessStatus::Lost))
            ->withAgent('Terminal', fn (TestAgent $terminal) => $terminal
                ->nameProcess('again', HostProcessPurpose::AgentTerminal))
            ->withAgent('Codex', fn (TestAgent $codex) => $codex
                ->nameProcess('codex again', HostProcessPurpose::AgentTerminal))
            ->hostProcess('again', fn (TestHostProcess $again) => $again->waitFor(HostProcessStatus::Running))
            ->hostProcess('codex again', fn (TestHostProcess $again) => $again->waitFor(HostProcessStatus::Running))
            ->assertJournal(fn (Assert $journal) => $journal
                ->count('testHost.codexStarts', 2)
                ->where(
                    'testHost.claudeStarts',
                    fn (array $starts) => $this->resumes($starts) === ['--session-id', '--resume'],
                ));
    }

    public function test_a_crashed_claude_code_terminal_starts_its_conversation_again_until_its_transcript_exists(): void
    {
        $healed = fn (int $times) => fn (Assert $journal) => $journal
            ->where('hostProcesses.terminal.generation', fn (int $generation) => $generation >= $times)
            ->where('testHost.claudeStarts', fn (array $starts) => count($starts) > $times);
        $answered = fn (Assert $journal) => $journal
            ->where(
                'hostProcesses.terminal.rows',
                fn (array|null $rows) => in_array('done', array_map(trim(...), $rows ?? []), true),
            );

        $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Terminal')
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac->chooseActiveAccounts())
            ->withAgent('Terminal', fn (TestAgent $terminal) => $terminal
                ->openRuntime('Mac', base_path(), driverType: DriverType::Terminal)
                ->proveStart(HostProcessPurpose::AgentTerminal, 'terminal'))
            ->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal
                ->driveUntil($this->composerShownOn('terminal')));
        $this->typeTaken('crash', fn (Assert $journal) => $this->isHealed($journal, 1));
        $this->journal->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal
            ->driveUntil($healed(1))
            ->driveUntil($this->composerShownOn('terminal')));
        $this->typeTaken("\e[200~hello\e[201~\r", fn (Assert $journal) => in_array(
            'done',
            array_map(trim(...), $journal->value('hostProcesses.terminal.rows') ?? []),
            true,
        ));
        $this->journal->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal
            ->driveUntil($answered)
            ->driveUntil($this->stillOn('terminal')));
        $this->typeTaken('crash', fn (Assert $journal) => $this->isHealed($journal, 2));

        $this->journal
            ->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal->driveUntil($healed(2)))
            ->assertJournal(fn (Assert $journal) => $journal->where(
                'testHost.claudeStarts',
                fn (array $starts) => $this->resumes($starts) === ['--session-id', '--session-id', '--resume'],
            ));
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
        $shows = fn (string $text) => fn (Assert $journal) => $journal
            ->where(
                'hostProcesses.keys.rows',
                fn (array|null $rows) => str_contains(implode("\n", $rows ?? []), $text),
            );

        $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, EchoProcessDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac
                ->openKeyRecorder('keys')
                ->process('keys', fn (TestHostProcess $keys) => $keys
                    ->waitFor(HostProcessStatus::Running)->driveUntil($shows('keys>'))));

        foreach ($sent as $keys => $screen) {
            $arrived = fn (Assert $journal) => $shows($screen)($journal
                ->where('testHost.keysRecorded.keys', fn (string $recorded) => str_ends_with($recorded, $keys)));
            $this->journal->hostProcess('keys', fn (TestHostProcess $process) => $process
                ->type($keys)->driveUntil($arrived));
        }

        $this->journal->assertJournal(fn (Assert $journal) => $journal
            ->where('testHost.keysRecorded.keys', implode('', array_keys($sent)))
            ->where(
                'hostProcesses.keys.rows',
                fn (array $rows) => array_slice(array_map(rtrim(...), $rows), 0, 2) === ['keys> helloa pasted line', 'done'],
            ));
    }

    public function test_a_headless_turn_held_across_its_hosts_restart_finishes_with_its_result_once(): void
    {
        $this->openHeadlessTurn('Run: ls.')
            ->testHost(fn (TestHost $mac) => $mac->restartHost()->releaseTurns())
            ->hostProcess('turn', fn (TestHostProcess $turn) => $turn->driveUntil($this->applied()));

        $turn = $this->journal->hostProcessCalled('turn')->id;
        $printed = implode('', array_map(
            fn ($entry) => $entry->printed(),
            $this->journal->service(ProcessFeed::class)->after($turn, ProcessFeed::FIRST_CURSOR, 0),
        ));
        $recorded = (string) file_get_contents(base_path('tests/Support/Hosts/fixtures/claude-turn.jsonl'));
        $this->journal
            ->assertResult($recorded, $printed)
            ->assertJournal(fn (Assert $journal) => $journal
                ->where('hostProcesses.turn.status', HostProcessStatus::Exited));
    }

    /**
     * A headless Claude agent on the test host with its mock, its first message held in its first turn after the
     * turn's first lines: the journal proved the build and the sign-in through their probes and opened the turn.
     */
    private function openHeadlessTurn(string $message): TestJournal
    {
        $this->chooseActiveAccounts();

        return $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Driven')
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac->holdTurns())
            ->withAgent('Driven', fn (TestAgent $driven) => $driven
                ->openRuntime('Mac', base_path(), firstMessage: $message)
                ->proveStart(HostProcessPurpose::AgentTurn, 'turn'))
            ->hostProcess('turn', fn (TestHostProcess $turn) => $turn->driveUntil(fn (Assert $journal) => $journal
                ->where('hostProcesses.turn.outputOffset', fn (int $offset) => $offset > 0)));
    }

    /**
     * The test host runs for a Claude Code and a Codex agent, with an account of each in the host's own folders.
     */
    private function arrangeTerminalHost(): self
    {
        $this->journal->owner()
            ->showDriverArrangements()
            ->idleAgent('Terminal')
            ->idleAgent('Codex')
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac->chooseActiveAccounts());

        return $this;
    }

    /**
     * Opens the agent's terminal of the driver, proves its start and drives it until a row of its screen is the
     * answer.
     */
    private function answerTerminal(
        string $agent,
        string $name,
        string $driver,
        string $build,
        string|null $model,
        string $answer,
    ): TestJournal {
        $answered = fn (Assert $journal) => $journal
            ->where(
                "hostProcesses.{$name}.rows",
                fn (array|null $rows) => in_array($answer, array_map(trim(...), $rows ?? []), true),
            );

        return $this->openTerminal($agent, $name, $driver, $build, $model)->journal
            ->hostProcess($name, fn (TestHostProcess $terminal) => $terminal->driveUntil($answered, seconds: 20));
    }

    /**
     * Opens the agent's terminal of the driver with its first message and proves its start; the turn is running.
     */
    private function openTerminal(string $agent, string $name, string $driver, string $build, string|null $model): self
    {
        $this->journal->withAgent($agent, fn (TestAgent $terminal) => $terminal
            ->openRuntime(
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
            )
            ->proveStart(HostProcessPurpose::AgentTerminal, $name));

        return $this;
    }

    /**
     * Interrupts the agent while its terminal's turn runs: the journal presses Escape on it and holds the runtime. An
     * input's bytes are forgotten once the host took it, so the Escape is known by the interrupt it was pressed for.
     */
    private function interruptRunningTurn(string $agent, string $name): self
    {
        $escaped = fn (Assert $journal) => $journal
            ->where("hostProcesses.{$name}.instructions", fn (array $instructions) => array_any(
                $instructions,
                fn (HostInstructionFacts $instruction) => $instruction->facts()['type'] === HostInstructionType::WriteKeys
                && $instruction->facts()['status'] === HostInstructionStatus::Done
                && in_array($instruction->facts()['request'], $journal->value("agents.{$agent}.runtime.interrupts"), true),
            ));

        $this->journal->hostProcess($name, fn (TestHostProcess $terminal) => $terminal->driveUntil(
            fn (Assert $journal) => $journal->where("agents.{$agent}.runtime.activity", RuntimeActivity::Running),
        ));
        $this->journal->asOwner(new InterruptAgentCommand(
            $this->journal->agentCalled($agent)->id,
            $this->journal->openedRuntimeOf($agent)->sessionId,
            "interrupt-{$name}",
        ));
        $this->journal->hostProcess($name, fn (TestHostProcess $terminal) => $terminal->driveUntil($escaped));

        return $this;
    }

    /**
     * Types the keys on the terminal until its host takes them or what they do shows: keys guarded by a screen that
     * moved before they arrived are refused, and typed again once the screen holds still.
     *
     * @param  Closure(Assert): bool  $isDone  whether what the keys do shows
     */
    private function typeTaken(string $keys, Closure $isDone): void
    {
        foreach (range(1, self::TYPING_TRIES) as $try) {
            $isTaken = fn (Assert $journal) => $this->lastKeysStatus($this->keysInstructions()) === HostInstructionStatus::Done
                || $isDone($journal);
            $this->journal->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal
                ->type($keys)->driveUntil(
                    fn (Assert $journal) => $journal->where(
                        'hostProcesses.terminal.instructions',
                        fn (array $instructions) => $this->lastKeysStatus($instructions) === HostInstructionStatus::Refused || $isTaken($journal),
                    ),
                ));
            $taken = false;
            $this->journal->assertJournal(function (Assert $journal) use ($isTaken, &$taken) {
                $taken = $isTaken($journal);
            });

            if ($taken) {
                return;
            }

            $this->journal->hostProcess('terminal', fn (TestHostProcess $terminal) => $terminal
                ->driveUntil($this->stillOn('terminal')));
        }
    }

    /**
     * The terminal's process was healed the times, and Claude Code started once more than that.
     */
    private function isHealed(Assert $journal, int $times): bool
    {
        return $journal->value('hostProcesses.terminal.generation') >= $times
            && count($journal->value('testHost.claudeStarts')) > $times;
    }

    /**
     * The status of the newest keys instruction among the instructions.
     *
     * @param  list<HostInstructionFacts>  $instructions
     */
    private function lastKeysStatus(array $instructions): HostInstructionStatus
    {
        $keys = array_values(array_filter($instructions, fn (HostInstructionFacts $instruction) => $instruction
            ->facts()['type'] === HostInstructionType::WriteKeys));

        return $keys[array_key_last($keys)]->facts()['status'];
    }

    /**
     * @return list<HostInstructionFacts>
     */
    private function keysInstructions(): array
    {
        return array_map(fn (HostInstruction $instruction) => new HostInstructionFacts($instruction), $this->journal->hostInstructionsOf('terminal'));
    }

    /**
     * The Claude Code mock drew its ready composer on the named terminal and its screen held still since, so keys
     * guarded by the screen the host last sent land on that screen.
     */
    private function composerShownOn(string $name): Closure
    {
        return fn (Assert $journal) => $this->stillOn($name)($journal)
            ->where(
                "hostProcesses.{$name}.rows",
                fn (array|null $rows) => str_contains(implode("\n", $rows ?? []), 'Try "'),
            );
    }

    /**
     * The screen the named terminal's host last sent held still for a while.
     */
    private function stillOn(string $name): Closure
    {
        return fn (Assert $journal) => $journal
            ->where(
                "hostProcesses.{$name}.stillMs",
                fn (int|null $still) => $still !== null && $still >= self::STILL_MS,
            );
    }

    private function applied(): Closure
    {
        return fn (Assert $journal) => $journal
            ->where('agents.Driven.runtime.firstRequest.progress', RequestProgress::Applied);
    }

    /**
     * The echo program's screen shows the text echoed back.
     */
    private function echoed(string $text): Closure
    {
        return fn (Assert $journal) => $journal
            ->where('hostProcesses.echo.rows', fn (array|null $rows) => in_array("echo: {$text}", $rows ?? [], true));
    }

    /**
     * The journal ordered the named process at least the number of instructions of the type.
     */
    private function ordered(string $name, HostInstructionType $type, int $count): Closure
    {
        return fn (Assert $journal) => $journal
            ->where("hostProcesses.{$name}.instructionCounts", fn (array $counts) => ($counts[$type->value] ?? 0) >= $count);
    }

    /**
     * Each start's arguments as how it opened its conversation: a fresh one or a resumed one.
     *
     * @param  list<list<string>>  $starts
     * @return list<string>
     */
    private function resumes(array $starts): array
    {
        return array_map(
            fn (array $arguments) => in_array('--resume', $arguments, true) ? '--resume' : '--session-id',
            $starts,
        );
    }

    private function stopOf(string $name): StopHostProcessCommand
    {
        return new StopHostProcessCommand(
            $this->journal->hostProcessCalled($name)->id,
            1000,
            1000,
            HostInstructionSource::fromJournal(),
        );
    }

    /**
     * The echo program runs on the test host for a runtime whose first message is hello.
     */
    private function startEchoSession(): TestJournal
    {
        $this->chooseActiveAccounts();

        return $this->journal
            ->driveProcessesWith(HostProcessPurpose::Probe, EchoProcessDriver::class)
            ->owner()
            ->showDriverArrangements()
            ->idleAgent('Echo')
            ->enrollHost('Mac', [base_path()])
            ->runTestHost('Mac', fn (TestHost $mac) => $mac)
            ->withAgent('Echo', fn (TestAgent $echo) => $echo
                ->openRuntime('Mac', base_path(), driverType: DriverType::Terminal, firstMessage: 'hello'))
            ->testHost(fn (TestHost $mac) => $mac
                ->openEchoContainer('echo', $this->journal->openedRuntimeOf('Echo')->runtimeId)
                ->process('echo', fn (TestHostProcess $echo) => $echo->waitFor(HostProcessStatus::Running)));
    }
}
