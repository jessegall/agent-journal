<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Agents\Drivers\ClaudeCode\ClaudeCodeChangeModel;
use App\Agents\Drivers\Commands\NotifyEntryReplayed\NotifyEntryReplayedCommand;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Commands\NotifyRuntimeActivity\NotifyRuntimeActivityCommand;
use App\Agents\Drivers\Contracts\ProcessDriver;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Drivers\Enums\HoldReason;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Agents\Drivers\Processes\TerminalDriver;
use App\Agents\Drivers\Values\EntryGoalAnswer;
use App\Agents\Drivers\Values\MenuStep;
use App\Agents\Drivers\Values\ScriptGoal;
use App\Hosts\Commands\ForwardUserKeys\ForwardUserKeysCommand;
use App\Hosts\Commands\SendHostKeys\SendHostKeysCommand;
use App\Hosts\Commands\StopHostProcess\StopHostProcessCommand;
use App\Hosts\Enums\HostInstructionStatus;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Protocol\HostInstructionType;
use App\Models\Hosts\HostInstruction;
use App\Navigation\Commands\MarkMenuEntryStale\MarkMenuEntryStaleCommand;
use App\Navigation\Commands\RaiseNavigation\RaiseNavigationCommand;
use App\Navigation\Enums\NavigationKey;
use App\Navigation\Enums\NavigationReason;
use App\Navigation\NavigationRaiseAnswer;
use App\Support\Reflector;
use App\Values\ClaimedRequest;
use App\Values\DriverActions;
use App\Values\FeedEntry;
use App\Values\HostInstructionSource;
use App\Values\LibraryEntryAnswer;
use App\Values\NavigationRound;
use App\Values\ScriptParameter;
use Tests\Fixtures\Drivers\ClaudeCodeModelPicker;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Hosts\RecordedTerminalHost;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The terminal driver types into Claude Code and Codex, on the recorded screens, what the recording's typist typed: a prompt
 * only into the empty, still composer, its Enter once the echo held still, Escape for an interrupt during the turn,
 * and a stop that ends the process; a menu holds the runtime and gets no key.
 */
#[TestsMachinery(TerminalDriver::class)]
final class TerminalDriverTest extends TestCase
{
    use RefreshHookDatabase;
    use WithActiveAccount;

    private const string TURN = 'claude-code/2.1.323/turns/terminal-turn';

    private const string MODEL_CHOICE = 'claude-code/2.1.323/keyscripts/model-choice';

    private const string CODEX_TURN = 'codex/0.165.0/turns/terminal-turn';

    /**
     * The label of the model picker's first entry, highlighted when it opens.
     */
    private const string DEFAULT_MODEL = 'Default (recommended) ✔';

    /**
     * Text the model picker shows while it is open, the proof of an entry that moves on it.
     */
    private const string PICKER_PROOF = 'Fastest for quick answers';

    private const int STREAM_MS = 100;

    private const string PASTE_START = "\e[200~";

    private const string PASTE_END = "\e[201~";

    /**
     * @var list<object>
     */
    private array $ordered = [];

    /**
     * @var list<string>
     */
    private array $pastes = [];

    public function test_a_turn_with_an_interrupt_and_a_second_prompt_types_what_the_recording_typed(): void
    {
        $driver = $this->drivenTerminal();
        $host = $this->journal->service(RecordedTerminalHost::class);
        $inputs = $host->recordedInputs();
        $events = [
            0 => fn () => $this->typeAsUser(0),
            1 => fn () => $this->typeAsUser(1),
            2 => fn () => $driver->onRequest($this->claim('deliver-1', DriverOperation::Deliver, $inputs[2])),
            5 => fn () => $driver->onRequest($this->claim('deliver-2', DriverOperation::Deliver, $inputs[5])),
            7 => fn () => $driver->onRequest($this->claim('stop-1', DriverOperation::Stop)),
        ];

        $isInterrupted = false;
        // The interrupt comes while the reply runs, once the prompt went in.
        $interrupt = function () use ($driver, &$isInterrupted) {
            if ($isInterrupted || ! $this->isApplying('deliver-1')) {
                return null;
            }

            $isInterrupted = true;

            return $driver->onRequest($this->claim('interrupt-1', DriverOperation::Interrupt));
        };

        $this->stream($driver, $events, $interrupt);

        $host->assertTypedThrough(6);
        $this->journal->assertResult(
            [true, true, [
                $this->pasted($inputs[2]),
                $this->pasted($inputs[5]),
            ], [
                2,
                1,
                2,
            ], true],
            [
                $this->hasOrdered(StopHostProcessCommand::class),
                $this->isHeldFor(HoldReason::TrustRequired),
                $this->pastes,
                [
                    $this->keyInstructionsOf('deliver-1'),
                    $this->keyInstructionsOf('interrupt-1'),
                    $this->keyInstructionsOf('deliver-2'),
                ],
                // Escape is guarded on the composer, which holds still while the turn above it moves.
                $this->firstGuardedRowOf('interrupt-1') > 0,
            ],
        );
    }

    public function test_an_interrupt_whose_escape_the_host_refused_presses_it_again_on_the_next_frame(): void
    {
        $driver = $this->drivenTerminal();
        $inputs = $this->journal->service(RecordedTerminalHost::class)->recordedInputs();
        $events = [
            0 => fn () => $this->typeAsUser(0),
            1 => fn () => $this->typeAsUser(1),
            2 => fn () => $driver->onRequest($this->claim('deliver-1', DriverOperation::Deliver, $inputs[2])),
        ];
        $presses = 0;
        // The interrupt comes once the reply runs, and the host refuses its first Escape as the screen moved.
        $interrupt = function () use ($driver, &$presses) {
            if ($presses === 0 && $this->isApplying('deliver-1')) {
                $presses = 1;

                return $driver->onRequest($this->claim('interrupt-1', DriverOperation::Interrupt));
            }

            if ($presses !== 1) {
                return null;
            }

            $presses = 2;
            $refused = new HostInstruction()->forceFill([
                'type' => HostInstructionType::WriteKeys,
                'status' => HostInstructionStatus::Refused,
                'driver_request_id' => 'interrupt-1',
            ]);

            return $driver->onAnswer($refused);
        };

        $this->stream($driver, $events, $interrupt);

        $this->journal->assertResult(
            [2, ['interrupt', 'interrupt-2']],
            [
                $this->keyInstructionsOf('interrupt-1'),
                array_map(fn (SendHostKeysCommand $keys) => $keys->source->step, $this->keysOf('interrupt-1')),
            ],
        );
    }

    public function test_a_codex_turn_with_an_interrupt_and_a_second_prompt_types_what_the_recording_typed(): void
    {
        // The Codex terminal opens to users once its starts go through the journal; its profile is the family's.
        $driver = $this->drivenTerminal(self::CODEX_TURN, DefaultDrivers::CODEX, DriverType::Headless);
        $host = $this->journal->service(RecordedTerminalHost::class);
        $inputs = $host->recordedInputs();
        $events = [
            0 => fn () => $driver->onRequest($this->claim('deliver-1', DriverOperation::Deliver, $inputs[0])),
            3 => fn () => $driver->onRequest($this->claim('deliver-2', DriverOperation::Deliver, $inputs[3])),
            5 => fn () => $driver->onRequest($this->claim('stop-1', DriverOperation::Stop)),
        ];
        $isInterrupted = false;
        $interrupt = function () use ($driver, &$isInterrupted) {
            if ($isInterrupted || ! $this->isApplying('deliver-1')) {
                return null;
            }

            $isInterrupted = true;

            return $driver->onRequest($this->claim('interrupt-1', DriverOperation::Interrupt));
        };

        $this->stream($driver, $events, $interrupt);

        // Codex takes no bracketed paste: each prompt is typed as it is.
        $host->assertTypedThrough(4);
        $this->journal->assertResult(
            [true, [], [
                2,
                1,
                2,
            ]],
            [
                $this->hasOrdered(StopHostProcessCommand::class),
                $this->pastes,
                [
                    $this->keyInstructionsOf('deliver-1'),
                    $this->keyInstructionsOf('interrupt-1'),
                    $this->keyInstructionsOf('deliver-2'),
                ],
            ],
        );
    }

    public function test_an_enter_the_composer_never_takes_goes_at_most_the_limit_then_the_delivery_is_uncertain(): void
    {
        $driver = $this->drivenTerminal();
        $rule = str_repeat('─', 40);
        $this->handle($driver->onOutput($this->entryOf(['', $rule, '❯ ', $rule], 2, 1_000)));
        $this->handle($driver->onRequest($this->claim('deliver-1', DriverOperation::Deliver, 'hello')));

        foreach (range(2_000, 20_000, 500) as $captured) {
            $this->handle($driver->onOutput($this->entryOf(['', $rule, '❯ hello', $rule], 7, $captured)));
        }

        $enters = array_filter(
            $this->ordered,
            fn (object $command) => $command instanceof SendHostKeysCommand && $command->bytes === NavigationKey::Enter->bytes(),
        );
        $this->journal->assertResult(
            [4, true],
            [count($enters), $this->hasReported('deliver-1', RequestProgress::DeliveryUncertain)],
        );
    }

    public function test_a_writer_holding_the_composer_gets_its_keys_typed_and_no_prompt_of_the_journal_goes_in(): void
    {
        $driver = $this->drivenTerminal();
        $rule = str_repeat('─', 40);
        $typed = json_encode([
            'grant_id' => 'grant-1',
            'sequence' => 1,
            'screen_revision' => 0,
            'text' => 'ls',
            'enter' => true,
            'type' => 'text',
            'key' => null,
            'rows' => 0,
            'columns' => 0,
        ], JSON_THROW_ON_ERROR);
        $this->handle($driver->onRequest($this->claim('take-1', DriverOperation::TakeControl, '{}')));
        $this->handle($driver->onRequest($this->claim('input-1', DriverOperation::TerminalInput, $typed)));
        $this->handle($driver->onRequest($this->claim('deliver-1', DriverOperation::Deliver, 'hello')));
        $this->handle($driver->onOutput($this->entryOf(['', $rule, '❯ ', $rule], 2, 1_000)));

        $forwarded = array_values(array_filter(
            $this->ordered,
            fn (object $command) => $command instanceof ForwardUserKeysCommand,
        ));
        $this->journal->assertResult(
            [["ls\r"], [], true],
            [
                array_map(fn (ForwardUserKeysCommand $command) => $command->bytes, $forwarded),
                $this->pastes,
                $this->hasReported('input-1', RequestProgress::Applied),
            ],
        );
    }

    public function test_a_named_key_script_that_meets_an_entry_the_menu_lacks_raises_navigation_with_its_screen(): void
    {
        $driver = $this->drivenModelPicker();
        $script = new ClaimedRequest(
            'runtime',
            'script-1',
            1,
            1,
            DriverOperation::KeyScript->value,
            null,
            [],
            null,
            null,
            'ChangeModel',
            2,
            [new ScriptParameter('model', 'Gemini 9')],
            null,
            null,
            null,
            'session',
            null,
            1,
        );

        $this->stream($driver, [], $this->scriptFirst($driver, $script));

        $raised = array_values(array_filter(
            $this->ordered,
            fn (object $command) => $command instanceof RaiseNavigationCommand,
        ));
        $this->journal->assertResult(
            [1, NavigationReason::LabelMissing, 'script-1', true],
            [
                count($raised),
                $raised[0]->uncertainty->reason,
                $raised[0]->requestId,
                str_starts_with($raised[0]->uncertainty->fingerprint, 'fp1:'),
            ],
        );
    }

    public function test_the_main_agents_round_chooses_the_entry_by_its_label_and_reports_the_screen_it_left(): void
    {
        $driver = $this->drivenModelPicker();
        $script = new ClaimedRequest(
            'runtime',
            'script-1',
            1,
            1,
            DriverOperation::KeyScript->value,
            null,
            [],
            null,
            null,
            'ChangeModel',
            2,
            [new ScriptParameter('model', 'Gemini 9')],
            null,
            null,
            null,
            'session',
            null,
            1,
        );
        $rounds = [];
        $raised = fn () => array_values(array_filter(
            $this->ordered,
            fn (object $command) => $command instanceof RaiseNavigationCommand,
        ));
        $round = function () use ($driver, $raised, &$rounds) {
            if ($raised() === [] || $rounds !== []) {
                return null;
            }

            $generation = $raised()[0]->uncertainty->screen->generation;
            $rounds[] = new NavigationRound('navigation-1', 1, $generation, confirm: self::DEFAULT_MODEL);
            $navigate = new ClaimedRequest(
                'runtime',
                'navigate-1',
                2,
                1,
                DriverOperation::Navigate->value,
                null,
                [],
                null,
                null,
                null,
                null,
                [],
                null,
                'navigation-1',
                $rounds[0],
                'session',
                null,
                1,
            );

            return $driver->onRequest($navigate);
        };

        $this->stream($driver, [], $this->scriptFirst($driver, $script, $round));

        $reports = array_values(array_filter(
            $this->ordered,
            fn (object $command) => $command instanceof NotifyRequestProgressCommand && $command->navigation !== null,
        ));
        $this->journal->assertResult([1, null], [count($reports), $reports[0]->navigation?->refusal]);
    }

    public function test_a_library_entry_that_reaches_its_proof_is_reported_replayed(): void
    {
        $steps = fn (string $picker) => [new MenuStep($picker, null, 'down', null)];

        $this->journal->assertResult([1, 0], $this->replayed($steps));
    }

    public function test_a_library_entry_whose_second_screen_never_comes_is_marked_stale_and_navigation_raised_again(): void
    {
        $this->journal->assertResult([0, 1], $this->replayed(fn (string $picker) => [
            new MenuStep($picker, null, 'down', null),
            new MenuStep('fp1:'.str_repeat('0', 64), 'Haiku 5.5', null, null),
        ]));
    }

    /**
     * A named key script stalls on the model picker, the journal answers its raise with a library entry of the steps
     * made for the picker's fingerprint, and the entry replays: how many replays were reported, and how many stale.
     *
     * @param  callable(string): list<MenuStep>  $steps
     * @return array{int, int}
     */
    private function replayed(callable $steps): array
    {
        $driver = $this->drivenModelPicker();
        $script = new ClaimedRequest(
            'runtime',
            'script-1',
            1,
            1,
            DriverOperation::KeyScript->value,
            null,
            [],
            null,
            null,
            'ChangeModel',
            2,
            [new ScriptParameter('model', 'Gemini 9')],
            null,
            null,
            null,
            'session',
            null,
            1,
        );
        $isAnswered = false;
        $answer = function () use ($driver, $steps, &$isAnswered) {
            $raised = array_values(array_filter(
                $this->ordered,
                fn (object $command) => $command instanceof RaiseNavigationCommand,
            ));

            if ($raised === [] || $isAnswered) {
                return null;
            }

            $isAnswered = true;
            $goal = EntryGoalAnswer::of(new ScriptGoal('ChangeModel', 2, ['model' => 'Haiku 5.5']));
            $made = $steps($raised[0]->uncertainty->fingerprint);
            $entry = new LibraryEntryAnswer('entry-1', 'claude-code', $goal, $made, 'goal', null, self::PICKER_PROOF);

            return $driver->onAnswered($raised[0], NavigationRaiseAnswer::entry($entry, false));
        };

        $this->stream($driver, [], $this->scriptFirst($driver, $script, $answer));

        return [
            count(array_filter($this->ordered, fn (object $command) => $command instanceof NotifyEntryReplayedCommand)),
            count(array_filter($this->ordered, fn (object $command) => $command instanceof MarkMenuEntryStaleCommand)),
        ];
    }

    /**
     * What the test does on every frame: the key script request on the first, before the recording's user typed,
     * and then what the test names, if anything.
     *
     * @param  (callable(): (DriverActions|null))|null  $then
     * @return callable(): (DriverActions|null)
     */
    private function scriptFirst(ProcessDriver $driver, ClaimedRequest $script, callable|null $then = null): callable
    {
        $isClaimed = false;

        return function () use ($driver, $script, $then, &$isClaimed) {
            if (! $isClaimed) {
                $isClaimed = true;

                return $driver->onRequest($script);
            }

            return $then === null ? null : $then();
        };
    }

    private function drivenModelPicker(): ProcessDriver
    {
        $this->journal->withDriverPart(ClaudeCodeChangeModel::class, ClaudeCodeModelPicker::class);

        return $this->drivenTerminal(self::MODEL_CHOICE);
    }

    /**
     * The recording plays on the mock host and a terminal of the driver, Claude Code unless named, of a started
     * session is open on it.
     */
    private function drivenTerminal(
        string $recording = self::TURN,
        string $driver = DefaultDrivers::CLAUDE_CODE,
        DriverType $driverType = DriverType::Terminal,
    ): ProcessDriver {
        $this->chooseActiveAccounts();
        $this->journal->owner()->showDriverArrangements()->idleAgent('Driven')->enrollHost('Mac', [base_path()]);
        $this->journal->withAgent('Driven', fn (TestAgent $driven) => $driven
            ->openRuntime('Mac', base_path(), $driver, driverType: $driverType));
        $opened = $this->journal->openedRuntimeOf('Driven');
        $this->journal
            ->driveProcessesWith(HostProcessPurpose::AgentTerminal, TerminalDriver::class)
            ->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcessForStart('agent', $opened->sessionId))
            ->playRecording($recording, $driver);

        return $this->journal->processDriverOf('agent');
    }

    /**
     * Streams the recording's frames to the driver, and at each recorded input's time does what the test names for
     * it: the user's own key, or a request the driver claims.
     *
     * @param  array<int, callable(): (DriverActions|null)>  $events
     * @param  (callable(): (DriverActions|null))|null  $everyFrame  what the test does on every frame besides
     */
    private function stream(ProcessDriver $driver, array $events, callable|null $everyFrame = null): void
    {
        $host = $this->journal->service(RecordedTerminalHost::class);

        foreach ($host->streamTimes(self::STREAM_MS) as $time) {
            $host->clock->set($time);
            $frame = $host->frame()->toJson();
            $this->handle($driver->onOutput(FeedEntry::of('frames', '1-0', ['frame' => $frame])));

            foreach ($events as $input => $event) {
                if ($host->inputOffset($input) <= $time) {
                    $this->handle($event());
                    unset($events[$input]);
                }
            }

            if ($everyFrame !== null) {
                $this->handle($everyFrame());
            }

        }
    }

    /**
     * Whether the driver reported the request applying: its prompt went in and the reply runs.
     */
    private function isApplying(string $requestId): bool
    {
        return array_any(
            $this->ordered,
            fn (object $command) => $command instanceof NotifyRequestProgressCommand
                && $command->requestId === $requestId
                && $command->progress === RequestProgress::Applying,
        );
    }

    private function handle(DriverActions|null $actions): void
    {
        foreach ($actions?->commands ?? [] as $command) {
            $this->ordered[] = $command;

            if ($command instanceof SendHostKeysCommand) {
                $typed = $this->typedOf($command->bytes);
                $this->journal->recordedTerminalHost(fn (RecordedTerminalHost $host) => $host
                    ->keys($command->processId, $typed, $command->rows, 0, $command->source));
            }
        }
    }

    private function typeAsUser(int $input): null
    {
        $host = $this->journal->service(RecordedTerminalHost::class);
        $host->advanceToInput($input);
        $guard = $host->guardFor(0, count($host->rows()) - 1);
        $host->keys('agent', $host->recordedInputs()[$input], $guard, 0, HostInstructionSource::fromJournal());

        return null;
    }

    /**
     * What the keys type: a bracketed paste is kept aside and its text typed, as the recording's typist typed it
     * plainly.
     */
    private function typedOf(string $bytes): string
    {
        if (! str_starts_with($bytes, self::PASTE_START)) {
            return $bytes;
        }

        $this->pastes[] = $bytes;

        return substr($bytes, strlen(self::PASTE_START), -strlen(self::PASTE_END));
    }

    private function pasted(string $text): string
    {
        return self::PASTE_START.$text.self::PASTE_END;
    }

    /**
     * @param  list<string>  $rows
     */
    private function entryOf(array $rows, int $cursorColumn, int $captured): FeedEntry
    {
        $frame = [
            'rows' => $rows,
            'cursor_row' => 2,
            'cursor_column' => $cursorColumn,
            'columns' => 40,
            'buffer' => 'normal',
            'captured' => $captured,
            'unchanged_ms' => array_fill(0, count($rows), 400),
        ];

        return FeedEntry::of('frames', '1-0', ['frame' => json_encode($frame, JSON_THROW_ON_ERROR)]);
    }

    private function claim(string $id, DriverOperation $operation, string|null $message = null): ClaimedRequest
    {
        return new ClaimedRequest(
            'runtime',
            $id,
            1,
            1,
            $operation->value,
            $message,
            [],
            null,
            null,
            null,
            null,
            [],
            null,
            null,
            null,
            'session',
            null,
            1,
        );
    }

    /**
     * How many key instructions the driver made for the request: a delivery takes its paste and one Enter.
     */
    private function keyInstructionsOf(string $requestId): int
    {
        return count($this->keysOf($requestId));
    }

    /**
     * The keys the driver ordered for the request, oldest first.
     *
     * @return list<SendHostKeysCommand>
     */
    private function keysOf(string $requestId): array
    {
        return array_values(array_filter(
            $this->ordered,
            fn (object $command) => $command instanceof SendHostKeysCommand && $command->source->driverRequestId === $requestId,
        ));
    }

    /**
     * The first screen row the request's first keys were guarded on.
     */
    private function firstGuardedRowOf(string $requestId): int
    {
        return $this->keysOf($requestId)[0]->rows->from;
    }

    /**
     * @param  class-string  $type
     */
    private function hasOrdered(string $type): bool
    {
        return array_any($this->ordered, fn (object $command) => Reflector::of($type)->isInstance($command));
    }

    private function isHeldFor(HoldReason $hold): bool
    {
        return array_any(
            $this->ordered,
            fn (object $command) => $command instanceof NotifyRuntimeActivityCommand && $command->hold === $hold,
        );
    }

    private function hasReported(string $requestId, RequestProgress $progress): bool
    {
        return array_any(
            $this->ordered,
            fn (object $command) => $command instanceof NotifyRequestProgressCommand
                && $command->requestId === $requestId
                && $command->progress === $progress,
        );
    }
}
