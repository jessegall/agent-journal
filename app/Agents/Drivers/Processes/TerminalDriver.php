<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Processes;

use App\Agents\Drivers\Commands\NotifyEntryReplayed\NotifyEntryReplayedCommand;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Commands\NotifyRuntimeActivity\NotifyRuntimeActivityCommand;
use App\Agents\Drivers\Contracts\ProcessDriver;
use App\Agents\Drivers\Enums\DeliveryStage;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\HoldReason;
use App\Agents\Drivers\Enums\RequestOutcome;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Agents\Drivers\Setup\DriverProfile;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Values\DriverLimits;
use App\Hosts\Commands\CloseHostPrivateEntry\CloseHostPrivateEntryCommand;
use App\Hosts\Commands\ForwardUserKeys\ForwardUserKeysCommand;
use App\Hosts\Commands\OpenHostPrivateEntry\OpenHostPrivateEntryCommand;
use App\Hosts\Commands\ResizeHostProcess\ResizeHostProcessCommand;
use App\Hosts\Commands\SendHostKeys\SendHostKeysCommand;
use App\Hosts\Commands\StopHostProcess\StopHostProcessCommand;
use App\Hosts\Commands\TakeHostProcessSnapshot\TakeHostProcessSnapshotCommand;
use App\Hosts\Commands\WriteHostPrivateValue\WriteHostPrivateValueCommand;
use App\Hosts\Data\HostFrameData;
use App\Hosts\Enums\HostOrderStatus;
use App\Hosts\Enums\HostOrderType;
use App\Messages\Data\DraftChoiceMessageData;
use App\Messages\Data\PrivateInputMessageData;
use App\Messages\Data\TerminalInputMessageData;
use App\Models\Agents\AgentRuntime;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
use App\Navigation\Commands\MarkMenuEntryStale\MarkMenuEntryStaleCommand;
use App\Navigation\Commands\RaiseNavigation\RaiseNavigationCommand;
use App\Navigation\Enums\NavigationKey;
use App\Navigation\Enums\NavigationRaiseOutcome;
use App\Navigation\Enums\NavigationReason;
use App\Navigation\NavigationRaiseAnswer;
use App\Processes\Enums\RuntimeActivity;
use App\Support\Command;
use App\Terminals\Enums\TerminalDraftChoice;
use App\Terminals\Enums\TerminalInputType;
use App\Terminals\KeyScripts\KeyMove;
use App\Terminals\KeyScripts\KeyScript;
use App\Terminals\KeyScripts\KeyScriptCatalogue;
use App\Terminals\KeyScripts\KeyScriptRun;
use App\Terminals\KeyScripts\KeyScriptRunner;
use App\Terminals\KeyScripts\KeyStep;
use App\Terminals\KeyScripts\ScreenExpectation;
use App\Terminals\Screens\Enums\KeyMoveType;
use App\Terminals\Screens\Enums\ScreenType;
use App\Terminals\Screens\RowRange;
use App\Terminals\Screens\ScreenClassifier;
use App\Terminals\Screens\ScreenFingerprint;
use App\Terminals\Screens\ScreenHolds;
use App\Terminals\Screens\ScreenLayout;
use App\Terminals\Screens\ScreenReading;
use App\Values\ClaimedRequest;
use App\Values\DriverActions;
use App\Values\FeedEntry;
use App\Values\HostOrderSource;
use App\Values\LibraryEntryAnswer;
use App\Values\NavigationRound;
use App\Values\NavigationRoundReport;
use App\Values\NavigationScreen;
use App\Values\NavigationUncertainty;
use App\Values\ScriptParameter;
use App\Values\TurnEnd;

/**
 * Drives an agent's terminal from the frames its host streams. It is ready once the composer holds still, pastes each
 * prompt into the empty composer and presses Enter once the echo shows, again at most the limit's times, and never
 * types over a draft; a menu holds the runtime for its reason unless it is answered with recorded keys. Model and
 * effort changes run their key script while the composer is idle; an interrupt presses Escape during a turn, and a
 * stop ends the process.
 */
final class TerminalDriver implements ProcessDriver
{
    private const string BRACKETED_PASTE_START = "\e[200~";

    private const string BRACKETED_PASTE_END = "\e[201~";

    /**
     * The line kill that empties the composer's line in the drivers the journal runs.
     */
    private const string CLEAR_LINE = "\x15";

    /**
     * Why a navigation round did nothing: its screen changed since the main agent saw it, or a key of it failed.
     */
    private const string SCREEN_CHANGED = 'screen_changed';

    private const string ROUND_FAILED = 'round_failed';

    /**
     * How long the echo of a paste must hold still before its Enter, so the Enter never lands in the paste's read.
     */
    private const int ECHO_QUIET_MS = 150;

    /**
     * The control characters a pasted prompt never carries; a newline and a tab stay text inside the paste.
     */
    private const string CONTROL_CHARACTERS = '/[\x00-\x08\x0b-\x1f\x7f]/';

    /**
     * The profile of the driver the terminal runs, Claude Code or Codex, by its runtime's driver.
     */
    private readonly DriverProfile $profile;

    private readonly ScreenLayout $layout;

    private readonly KeyScriptCatalogue $catalogue;

    private HostFrameData|null $frame = null;

    private int|null $firstCaptured = null;

    private bool $hasBeenReady = false;

    /**
     * Whether a browser writer holds the composer: nothing of the journal is typed until it lets go.
     */
    private bool $isTaken = false;

    private HoldReason $hold = HoldReason::None;

    /**
     * The prompts and changes that wait for an idle, ready composer, in the order they were claimed.
     *
     * @var list<ClaimedRequest>
     */
    private array $waiting = [];

    private ClaimedRequest|null $delivery = null;

    private DeliveryStage $stage = DeliveryStage::Pasted;

    /**
     * The composer's rows as the stage's key found them, none before the first key, and when that key went, by the
     * host's clock.
     */
    private string|null $stageRows = null;

    private int $stageAt = 0;

    private int $enters = 0;

    private int $keyOrders = 0;

    private ClaimedRequest|null $turn = null;

    private int $turnBegan = 0;

    private bool $hasComposerLeft = false;

    private KeyScriptRun|null $script = null;

    private ClaimedRequest|null $scriptRequest = null;

    /**
     * The named key script that stalled and raised navigation, and the library entry replayed in its place.
     */
    private ClaimedRequest|null $stalled = null;

    private LibraryEntryAnswer|null $replaying = null;

    /**
     * @var list<string>
     */
    private array $declined = [];

    /**
     * The interrupts claimed while a turn ran, by request id and attempt; each settles when the turn ends.
     *
     * @var array<string, int>
     */
    private array $interrupts = [];

    public function __construct(
        private readonly HostProcess $process,
        private readonly int $generation,
        DriverProfiles $profiles,
        private readonly ScreenClassifier $classifier,
        private readonly ScreenHolds $holds,
        private readonly KeyScriptRunner $scripts,
        private readonly ScreenFingerprint $fingerprints,
        private readonly DriverLimits $limits,
    ) {
        $runtime = AgentRuntime::query()->findOrFail($process->agent_runtime_id);
        $this->profile = $profiles->of($runtime);
        $this->layout = $this->profile->layout();
        $this->catalogue = new KeyScriptCatalogue($this->profile->keyScripts());
    }

    /**
     * A worker that takes over reads the screen afresh: it orders a snapshot, and the requests in flight are claimed
     * again by their own attempts.
     */
    public function resume(array $flight, array $ordered): DriverActions
    {
        return DriverActions::of($this->snapshot());
    }

    public function onOutput(FeedEntry $entry): DriverActions
    {
        if ($entry->frame === null) {
            return DriverActions::none();
        }

        $this->frame = $entry->frame;
        $this->firstCaptured ??= $entry->frame->captured;

        return $this->onFrame($entry->frame);
    }

    public function onRequest(ClaimedRequest $request): DriverActions
    {
        return match (DriverOperation::tryFrom($request->operation)) {
            DriverOperation::Deliver,
            DriverOperation::Wake,
            DriverOperation::ChangeModel,
            DriverOperation::ChangeEffort,
            DriverOperation::KeyScript => $this->stage($request),
            DriverOperation::Interrupt => $this->interrupt($request),
            DriverOperation::OpenPrivateEntry => DriverActions::of(
                new OpenHostPrivateEntryCommand($this->process->id, $this->sourceOf($request, 'open-private')),
            ),
            DriverOperation::PrivateInput => $this->writePrivate($request),
            DriverOperation::CancelPrivateEntry => DriverActions::of(
                new CloseHostPrivateEntryCommand($this->process->id, $this->sourceOf($request, 'close-private')),
            ),
            DriverOperation::TakeControl => $this->hold($request, true),
            DriverOperation::CancelTake, DriverOperation::ReleaseControl => $this->hold($request, false),
            DriverOperation::TerminalInput => $this->userInput($request),
            DriverOperation::Navigate => $this->navigate($request),
            DriverOperation::DraftChoice => $this->draftChoice($request),
            DriverOperation::Stop => DriverActions::of(
                $this->activity(RuntimeActivity::Stopping, $this->hold),
                new StopHostProcessCommand(
                    $this->process->id,
                    $this->limits->stopGraceMs,
                    $this->limits->stopForceMs,
                    $this->sourceOf($request, 'stop'),
                ),
            ),
            default => DriverActions::none(),
        };
    }

    /**
     * A key the host refused because the rows it was read on moved goes again from a fresh snapshot: the stage it
     * was for is read anew on the next frame.
     */
    public function onAnswer(HostOrder $order): DriverActions
    {
        if ($order->type !== HostOrderType::WriteKeys || $order->status !== HostOrderStatus::Refused) {
            return DriverActions::none();
        }

        if ($this->delivery !== null && $order->driver_request_id === $this->delivery->requestId) {
            $this->waiting = [
                $this->delivery,
                ...$this->waiting,
            ];

            $this->delivery = null;
        }

        return DriverActions::of($this->snapshot());
    }

    /**
     * The journal answered a raise of navigation with a library entry: it replays in place of the stalled script.
     *
     * @param  Command<mixed>  $command
     */
    public function onAnswered(Command $command, mixed $answer): DriverActions
    {
        $isEntry = $answer instanceof NavigationRaiseAnswer && $answer->answer === NavigationRaiseOutcome::Entry;

        if (! $command instanceof RaiseNavigationCommand || ! $isEntry || $answer->entry === null) {
            return DriverActions::none();
        }

        if ($this->stalled === null || $this->frame === null) {
            return DriverActions::none();
        }

        $entry = $answer->entry;
        $steps = [];

        foreach ($entry->steps as $index => $step) {
            $keys = $step->key === null ? '' : NavigationKey::from($step->key)->bytes();
            $steps[] = KeyStep::ofEntry($index, $step->fingerprint, $step->choose, $keys);
        }

        if ($entry->proof !== '') {
            $steps[] = KeyStep::evidence('see the entry proven', $entry->proof);
        }

        $build = $this->profile->build();
        $script = new KeyScript("entry {$entry->id}", $this->profile->family(), $build, [], $steps);
        $this->script = new KeyScriptRun($script, ScriptParameter::byName($this->stalled->scriptParameters));
        $this->scriptRequest = $this->stalled;
        $this->replaying = $entry;

        return $this->scripted($this->script, $this->frame);
    }

    public function onExit(): DriverActions
    {
        $end = new TurnEnd(exitCode: $this->process->refresh()->exit_code);

        $open = array_filter([$this->turn, $this->delivery, $this->scriptRequest]);

        $reports = array_map(
            fn (ClaimedRequest $request) => $this->endReport($request->requestId, $request->attempt, $end),
            $open,
        );

        foreach ($this->interrupts as $requestId => $attempt) {
            $reports[] = $this->endReport($requestId, $attempt, $end);
        }

        return DriverActions::of(...array_values($reports));
    }

    private function onFrame(HostFrameData $frame): DriverActions
    {
        if ($frame->isShielded) {
            return DriverActions::none();
        }

        $reading = $this->classifier->readingOf($this->layout, $frame);

        return match (true) {
            $this->delivery !== null => $this->delivered($this->delivery, $frame),
            $this->script !== null => $this->scripted($this->script, $frame),
            $this->turn !== null => $this->turnEnded($this->turn, $reading, $frame),
            default => $this->idle($reading, $frame),
        };
    }

    private function stage(ClaimedRequest $request): DriverActions
    {
        $this->waiting[] = $request;
        $staged = DriverActions::of($this->progress($request, RequestProgress::Staged));

        if ($this->frame === null) {
            return $staged;
        }

        return $staged->then($this->onFrame($this->frame));
    }

    /**
     * An interrupt presses Escape during a turn and holds the runtime interrupted; with no turn running it is done.
     */
    private function interrupt(ClaimedRequest $request): DriverActions
    {
        if ($this->turn === null || $this->frame === null) {
            return DriverActions::of($this->progress($request, RequestProgress::Applied));
        }

        $this->interrupts[$request->requestId] = $request->attempt;
        $frame = $this->frame;
        $whole = new RowRange(0, count($frame->rows));

        return DriverActions::of(
            $this->keys(NavigationKey::Esc->bytes(), $whole, $frame, $this->sourceOf($request, 'interrupt')),
            $this->activity(RuntimeActivity::Interrupting, HoldReason::Interrupted),
        );
    }

    /**
     * A browser writer takes the composer or lets it go; while it holds it, no prompt of the journal goes in.
     */
    private function hold(ClaimedRequest $request, bool $isTaken): DriverActions
    {
        $this->isTaken = $isTaken;

        return DriverActions::of($this->progress($request, RequestProgress::Applied));
    }

    /**
     * What a browser writer typed goes to the process as the user's own keys: text, a bracketed paste, a named key,
     * each with Enter when asked, or a new size of the terminal.
     */
    private function userInput(ClaimedRequest $request): DriverActions
    {
        $input = $request->messageAs(TerminalInputMessageData::class);
        $source = $this->sourceOf($request, 'input');
        $enter = $input->shouldEnter ? NavigationKey::Enter->bytes() : '';
        $applied = $this->progress($request, RequestProgress::Applied);

        if ($input->type === TerminalInputType::Resize) {
            $resize = new ResizeHostProcessCommand($this->process->id, $input->columns, $input->rows, $source);

            return DriverActions::of($resize, $applied);
        }

        $bytes = match ($input->type) {
            TerminalInputType::Key => $input->key?->bytes() ?? '',
            TerminalInputType::Paste => self::BRACKETED_PASTE_START.$input->text.self::BRACKETED_PASTE_END.$enter,
            default => $input->text.$enter,
        };

        return DriverActions::of(new ForwardUserKeysCommand($this->process->id, $bytes, $source), $applied);
    }

    /**
     * The writer's choice for the draft in the composer: send it, clear the line so the journal's prompt can go in,
     * or cancel the prompts that wait behind it.
     */
    private function draftChoice(ClaimedRequest $request): DriverActions
    {
        $draft = $request->messageAs(DraftChoiceMessageData::class);
        $source = $this->sourceOf($request, 'draft');
        $applied = $this->progress($request, RequestProgress::Applied);

        return match ($draft->choice) {
            TerminalDraftChoice::Send => DriverActions::of(
                new ForwardUserKeysCommand($this->process->id, NavigationKey::Enter->bytes(), $source),
                $applied,
            ),
            TerminalDraftChoice::SaveAndClear => DriverActions::of(
                new ForwardUserKeysCommand($this->process->id, self::CLEAR_LINE, $source),
                $applied,
            ),
            TerminalDraftChoice::CancelPendingWork => $this->cancelWaiting()->then(DriverActions::of($applied)),
        };
    }

    private function cancelWaiting(): DriverActions
    {
        $cancelled = array_map(
            fn (ClaimedRequest $waiting) => $this->progress($waiting, RequestProgress::Cancelled),
            $this->waiting,
        );

        $this->waiting = [];

        return DriverActions::of(...$cancelled);
    }

    /**
     * A private value goes in by its submission alone, which the host pulls once, and the entry closes after it.
     */
    private function writePrivate(ClaimedRequest $request): DriverActions
    {
        $private = $request->messageAs(PrivateInputMessageData::class);
        $submission = $private->submissionId;
        $source = $this->sourceOf($request, 'write-private');

        return DriverActions::of(
            new WriteHostPrivateValueCommand($this->process->id, $submission, $source),
            new CloseHostPrivateEntryCommand($this->process->id, $this->sourceOf($request, 'close-private')),
        );
    }

    /**
     * An idle screen: a ready composer takes the next waiting request; a still menu is answered with its recorded
     * keys or holds the runtime for its reason; a start that is not ready within its wait ends.
     */
    private function idle(ScreenReading $reading, HostFrameData $frame): DriverActions
    {
        $waited = $frame->captured - (int) $this->firstCaptured;
        $isOverdue = ! $this->hasBeenReady && $waited > $this->limits->readyWaitMs;

        if (! $reading->isStill) {
            if ($isOverdue) {
                return $this->stuck();
            }

            return DriverActions::none();
        }

        if ($reading->type === ScreenType::PromptReady) {
            return $this->ready($frame);
        }

        $hold = $this->holds->holdOf($reading);
        $menu = $reading->menuRowsOf($frame);

        if ($hold->answer !== null && $menu !== null) {
            $source = HostOrderSource::forWorker($this->generation);

            return DriverActions::of($this->keys($hold->answer, $menu, $frame, $source));
        }

        $actions = $isOverdue ? $this->stuck() : DriverActions::none();

        // A screen held for the same reason as the frame before tells the journal nothing new.
        if ($hold->reason === $this->hold) {
            return $actions;
        }

        $this->hold = $hold->reason;

        return DriverActions::of($this->activity(RuntimeActivity::Idle, $hold->reason))->then($actions);
    }

    /**
     * A start whose composer never came within its wait ends, holding what the screen showed.
     */
    private function stuck(): DriverActions
    {
        $hold = $this->hold === HoldReason::None ? HoldReason::UnknownScreen : $this->hold;

        return DriverActions::of(
            $this->activity(RuntimeActivity::Stopping, $hold),
            new StopHostProcessCommand(
                $this->process->id,
                $this->limits->stopGraceMs,
                $this->limits->stopForceMs,
                HostOrderSource::forWorker($this->generation),
            ),
        );
    }

    /**
     * The composer is ready: the runtime is idle with nothing held, and the oldest waiting request goes in.
     */
    private function ready(HostFrameData $frame): DriverActions
    {
        $actions = DriverActions::none();

        if (! $this->hasBeenReady || $this->hold !== HoldReason::None) {
            $this->hasBeenReady = true;
            $this->hold = HoldReason::None;
            $actions = DriverActions::of($this->activity(RuntimeActivity::Idle, HoldReason::None));
        }

        $request = $this->isTaken ? null : array_shift($this->waiting);

        if ($request === null) {
            return $actions;
        }

        $operation = DriverOperation::from($request->operation);

        $scripted = [DriverOperation::ChangeModel, DriverOperation::ChangeEffort, DriverOperation::KeyScript];

        if (in_array($operation, $scripted, true)) {
            return $actions->then($this->startScript($request, $operation, $frame));
        }

        return $actions->then($this->paste($request, $frame));
    }

    private function paste(ClaimedRequest $request, HostFrameData $frame): DriverActions
    {
        $composer = $this->layout->composer->rowsOf($frame);
        $text = (string) preg_replace(self::CONTROL_CHARACTERS, '', (string) $request->prompt());

        if ($composer === null) {
            $this->waiting = [
                $request,
                ...$this->waiting,
            ];

            return DriverActions::none();
        }

        $pasted = $text;

        if ($this->layout->isBracketedPaste) {
            $pasted = self::BRACKETED_PASTE_START.$text.self::BRACKETED_PASTE_END;
        }

        $this->delivery = $request;
        $this->onStage(DeliveryStage::Pasted, $composer, $frame);
        $this->enters = 0;

        return DriverActions::of($this->keys($pasted, $composer, $frame, $this->sourceOf($request, 'paste')));
    }

    /**
     * A pasted prompt gets Enter once its echo held still, then again while the composer keeps the line, at most the
     * limit's times; a lost echo or a line never taken leaves the delivery uncertain.
     */
    private function delivered(ClaimedRequest $request, HostFrameData $frame): DriverActions
    {
        $composer = $this->layout->composer->rowsOf($frame);
        $rows = $composer?->guardOn($frame)->hash;
        $waited = $frame->captured - $this->stageAt;

        if ($this->stage === DeliveryStage::Pasted) {
            if ($composer !== null && $rows !== $this->stageRows && self::isQuiet($composer, $frame)) {
                $this->enters = 0;

                return $this->pressEnter($request, $composer, $frame);
            }

            if ($waited > $this->limits->echoWaitMs) {
                return $this->uncertain($request);
            }

            return DriverActions::none();
        }

        if ($composer === null || $rows !== $this->stageRows) {
            return $this->startTurn($request, $frame);
        }

        if ($waited <= $this->limits->unsentLookMs) {
            return DriverActions::none();
        }

        if ($this->enters > $this->limits->unsentEnters) {
            return $this->uncertain($request);
        }

        return $this->pressEnter($request, $composer, $frame);
    }

    /**
     * Enter for the pasted prompt, counted, so its order is the delivery's next.
     */
    private function pressEnter(ClaimedRequest $request, RowRange $composer, HostFrameData $frame): DriverActions
    {
        $this->enters++;
        $this->onStage(DeliveryStage::Entered, $composer, $frame);
        $source = $this->sourceOf($request, "enter-{$this->enters}");

        return DriverActions::of($this->keys(NavigationKey::Enter->bytes(), $composer, $frame, $source));
    }

    private function startTurn(ClaimedRequest $request, HostFrameData $frame): DriverActions
    {
        $this->delivery = null;
        $this->turn = $request;
        $this->turnBegan = $frame->captured;
        $this->hasComposerLeft = false;

        return DriverActions::of(
            $this->progress($request, RequestProgress::Applying),
            $this->activity(RuntimeActivity::Running, HoldReason::None),
        );
    }

    /**
     * A turn ends once the composer left and came back ready and still, or stayed ready past the turn's start window.
     */
    private function turnEnded(ClaimedRequest $request, ScreenReading $reading, HostFrameData $frame): DriverActions
    {
        if ($reading->type !== ScreenType::PromptReady || ! $reading->isStill) {
            $this->hasComposerLeft = true;

            return DriverActions::none();
        }

        if (! $this->hasComposerLeft && $frame->captured - $this->turnBegan < $this->limits->turnStartWindowMs) {
            return DriverActions::none();
        }

        $end = new TurnEnd(composerLeft: $this->hasComposerLeft);
        $reports = [$this->endReport($request->requestId, $request->attempt, $end)];

        foreach ($this->interrupts as $requestId => $attempt) {
            $reports[] = $this->endReport($requestId, $attempt, $end);
        }

        $this->turn = null;
        $this->interrupts = [];

        return DriverActions::of(...$reports)->then($this->ready($frame));
    }

    private function startScript(
        ClaimedRequest $request,
        DriverOperation $operation,
        HostFrameData $frame,
    ): DriverActions {
        [$name, $values] = match ($operation) {
            DriverOperation::ChangeModel => [
                'ChangeModel',
                ['model' => (string) $request->model],
            ],
            DriverOperation::ChangeEffort => [
                'ChangeEffort',
                ['effort' => (string) $request->effort],
            ],
            default => [
                (string) $request->script,
                ScriptParameter::byName($request->scriptParameters),
            ],
        };

        $script = $this->catalogue->scriptFor($this->profile->family(), $this->profile->build(), $name);
        $this->script = new KeyScriptRun($script, $values, $request->scriptStep ?? 0);
        $this->scriptRequest = $request;

        return $this->scripted($this->script, $frame);
    }

    /**
     * One frame of a running key script: its key goes, or it finishes, or it ends without a key.
     */
    private function scripted(KeyScriptRun $run, HostFrameData $frame): DriverActions
    {
        $request = $this->scriptRequest;
        $move = $this->scripts->moveOn($this->layout, $run, $frame);
        $this->script = $move->run;

        if ($request === null) {
            return DriverActions::none();
        }

        $isOver = $move->type !== KeyMoveType::Wait && $move->type !== KeyMoveType::Send;

        if ($this->replaying !== null && $isOver) {
            return $this->replayEnded($this->replaying, $request, $move, $frame);
        }

        return match ($move->type) {
            KeyMoveType::Wait => DriverActions::none(),
            KeyMoveType::Send => DriverActions::of($this->scriptKeys($move, $frame, $request)),
            KeyMoveType::Finished => $this->isRound($request)
                ? $this->roundEnded($request, $frame, null)
                : $this->scriptEnded($request, RequestProgress::Applied, null),
            KeyMoveType::Uncertain => $this->scriptUncertain($request, $move, $frame),
            KeyMoveType::Failed => $this->isRound($request)
                ? $this->roundEnded($request, $frame, self::ROUND_FAILED)
                : $this->scriptEnded($request, RequestProgress::Failed, null),
        };
    }

    private function scriptKeys(KeyMove $move, HostFrameData $frame, ClaimedRequest $request): SendHostKeysCommand
    {
        $this->keyOrders++;

        return new SendHostKeysCommand(
            $this->process->id,
            $move->keys,
            $move->guardOn($frame),
            $this->process->refresh()->input_generation,
            $this->sourceOf($request, "key-{$this->keyOrders}"),
        );
    }

    /**
     * A script that cannot be certain of its next key ends without one: an entry the menu does not show is
     * unavailable, any other doubt leaves the change uncertain.
     */
    private function scriptUncertain(ClaimedRequest $request, KeyMove $move, HostFrameData $frame): DriverActions
    {
        if ($this->isRound($request)) {
            return $this->roundEnded($request, $frame, $move->reason->value ?? self::ROUND_FAILED);
        }

        $isNamedScript = $request->operation === DriverOperation::KeyScript->value;

        if ($isNamedScript && ! $frame->isShielded && $move->reason !== null) {
            return $this->navigationNeeded($request, $move, $move->reason, $frame);
        }

        if ($move->reason === NavigationReason::LabelMissing) {
            return $this->scriptEnded($request, RequestProgress::Failed, RequestOutcome::EntryUnavailable);
        }

        return $this->scriptEnded($request, RequestProgress::DeliveryUncertain, null);
    }

    /**
     * A named key script that cannot be certain of its next key asks the main agent to navigate: the journal is told
     * why, at which step, and the screen it stopped on with its fingerprint, its rows redacted.
     */
    private function navigationNeeded(
        ClaimedRequest $request,
        KeyMove $move,
        NavigationReason $reason,
        HostFrameData $frame,
        string|null $staleEntryId = null,
    ): DriverActions {
        $this->script = null;
        $this->scriptRequest = null;
        $this->stalled = $request;
        $reading = $this->classifier->readingOf($this->layout, $frame);
        $menu = $reading->menu?->name;
        $fingerprint = $this->fingerprints->of($this->layout, $this->profile->family(), $frame, $menu);
        $entries = $this->layout->optionList()->entriesOf($frame);

        $screen = new NavigationScreen(
            array_map(ScreenFingerprint::redacted(...), $frame->rows),
            $entries?->highlighted,
            self::generationOf($frame),
        );

        $uncertainty = new NavigationUncertainty($reason, $move->run->step, $fingerprint, $screen, $staleEntryId);
        $key = "{$request->requestId}:{$request->attempt}:{$move->run->step}";

        if ($this->declined !== []) {
            $key .= ':declined:'.implode(',', $this->declined);
        }

        return DriverActions::of(new RaiseNavigationCommand(
            $this->process->host_id,
            (string) $this->process->agent_runtime_id,
            $key,
            $request->requestId,
            $request->attempt,
            $uncertainty,
            $this->declined,
        ));
    }

    /**
     * A replayed library entry ended. Proven, the journal is told and the stalled script goes on from the entry's
     * next step or is done. Failed after its first step, or without its proof, it no longer fits this build: it is
     * marked stale with the screen it failed on and navigation is raised again without it. Failed at its first
     * step, two menus may share a fingerprint, so it is only declined.
     */
    private function replayEnded(
        LibraryEntryAnswer $entry,
        ClaimedRequest $request,
        KeyMove $move,
        HostFrameData $frame,
    ): DriverActions {
        $this->replaying = null;
        $this->script = null;
        $this->declined[] = $entry->id;

        if ($move->type === KeyMoveType::Finished) {
            return $this->replayProven($entry, $request);
        }

        $isLastStep = $move->run->isOnLastStep();
        $isStale = $move->run->step > 0 || ($entry->proof !== '' && $isLastStep);
        $reason = $isStale ? NavigationReason::StaleEntry : ($move->reason ?? NavigationReason::NoEntry);
        $actions = DriverActions::none();

        if ($isStale) {
            $actions = DriverActions::of(new MarkMenuEntryStaleCommand(
                $this->process->host_id,
                $entry->id,
                (string) $this->process->agent_runtime_id,
                $move->reason ?? NavigationReason::NoProof,
                $move->run->step,
                $this->profile->build(),
                array_map(ScreenFingerprint::redacted(...), $frame->rows),
            ));
        }

        $stalledAt = new KeyScriptRun($move->run->script, $move->run->values, (int) $request->scriptStep);

        $raise = $this->navigationNeeded(
            $request,
            KeyMove::uncertain($stalledAt, $reason),
            $reason,
            $frame,
            $isStale ? $entry->id : null,
        );

        return $actions->then($raise);
    }

    private function replayProven(LibraryEntryAnswer $entry, ClaimedRequest $request): DriverActions
    {
        $this->stalled = null;
        $this->declined = [];

        $replayed = new NotifyEntryReplayedCommand(
            $this->process->host_id,
            $entry->id,
            (string) $this->process->agent_runtime_id,
            "{$request->requestId}:{$request->attempt}:replay:{$entry->id}",
        );

        if ($entry->nextStep === null || $this->frame === null) {
            $this->scriptRequest = null;

            return DriverActions::of($replayed, $this->progress($request, RequestProgress::Applied));
        }

        $build = $this->profile->build();
        $script = $this->catalogue->scriptFor($this->profile->family(), $build, (string) $request->script);
        $values = ScriptParameter::byName($request->scriptParameters);
        $this->script = new KeyScriptRun($script, $values, $entry->nextStep);
        $this->scriptRequest = $request;

        return DriverActions::of($replayed)->then($this->scripted($this->script, $this->frame));
    }

    /**
     * The main agent's round on the stalled screen goes as a short key script of its own: its keys, a choice or a
     * confirmation by label, a typed parameter, or a look for its proof; refused on a screen that changed since the
     * main agent saw it.
     */
    private function navigate(ClaimedRequest $request): DriverActions
    {
        $round = $request->navigationRound;

        if ($round === null || $this->frame === null) {
            return DriverActions::of($this->progress($request, RequestProgress::Failed));
        }

        if ($round->generation !== self::generationOf($this->frame)) {
            return $this->roundEnded($request, $this->frame, self::SCREEN_CHANGED);
        }

        $values = ScriptParameter::byName($request->scriptParameters);
        $steps = self::roundSteps($round, $values);
        $script = new KeyScript('navigation', $this->profile->family(), $this->profile->build(), [], $steps);
        $this->script = new KeyScriptRun($script, $values);
        $this->scriptRequest = $request;

        return $this->scripted($this->script, $this->frame);
    }

    /**
     * @param  array<string, string>  $values
     * @return list<KeyStep>
     */
    private static function roundSteps(NavigationRound $round, array $values): array
    {
        $still = ScreenExpectation::still();

        return match (true) {
            $round->keys !== [] => array_map(
                fn (NavigationKey $key) => KeyStep::press($key->value, $still, $key->bytes()),
                $round->keys,
            ),
            $round->choose !== null => [KeyStep::chooseOnScreen($round->choose)],
            $round->confirm !== null => [KeyStep::confirmOnScreen($round->confirm)],
            $round->typeParameter !== null => [
                KeyStep::press("type {$round->typeParameter}", $still, $values[$round->typeParameter] ?? ''),
            ],
            default => [KeyStep::evidence('see the proof', (string) $round->proof)],
        };
    }

    private function isRound(ClaimedRequest $request): bool
    {
        return $request->operation === DriverOperation::Navigate->value;
    }

    /**
     * A round ended: the journal is told the screen it left, its rows redacted, whether its proof showed, and the
     * refusal that stopped it.
     */
    private function roundEnded(ClaimedRequest $request, HostFrameData $frame, string|null $refusal): DriverActions
    {
        $this->script = null;
        $this->scriptRequest = null;
        $entries = $this->layout->optionList()->entriesOf($frame);
        $hasProof = $refusal === null && $request->navigationRound?->proof !== null;

        $report = new NavigationRoundReport(
            array_map(ScreenFingerprint::redacted(...), $frame->rows),
            $entries?->highlighted,
            self::generationOf($frame),
            $hasProof,
            $refusal,
        );

        return DriverActions::of(new NotifyRequestProgressCommand(
            $this->process->host_id,
            $request->requestId,
            $request->attempt,
            RequestProgress::Applied,
            null,
            null,
            navigation: $report,
        ));
    }

    /**
     * The generation of the screen drawn: when it last changed by the host's clock, the same on every frame of an
     * unchanged screen, so a round refuses a screen that changed since the main agent saw it.
     */
    private static function generationOf(HostFrameData $frame): int
    {
        if ($frame->unchangedMs === []) {
            return $frame->captured;
        }

        return $frame->captured - min($frame->unchangedMs);
    }

    private function scriptEnded(
        ClaimedRequest $request,
        RequestProgress $progress,
        RequestOutcome|null $outcome,
    ): DriverActions {
        $this->script = null;
        $this->scriptRequest = null;

        return DriverActions::of(new NotifyRequestProgressCommand(
            $this->process->host_id,
            $request->requestId,
            $request->attempt,
            $progress,
            null,
            $outcome,
        ));
    }

    private function uncertain(ClaimedRequest $request): DriverActions
    {
        $this->delivery = null;

        return DriverActions::of($this->progress($request, RequestProgress::DeliveryUncertain));
    }

    private function onStage(DeliveryStage $stage, RowRange $composer, HostFrameData $frame): void
    {
        $this->stage = $stage;
        $this->stageRows = $composer->guardOn($frame)->hash;
        $this->stageAt = $frame->captured;
    }

    /**
     * Whether each of the composer's rows held still long enough that an Enter never lands in the paste's read.
     */
    private static function isQuiet(RowRange $composer, HostFrameData $frame): bool
    {
        return array_all($composer->rows(), fn (int $row) => ($frame->unchangedMs[$row] ?? 0) >= self::ECHO_QUIET_MS);
    }

    /**
     * The keys, guarded by the rows of the frame they were read on.
     */
    private function keys(
        string $bytes,
        RowRange $rows,
        HostFrameData $frame,
        HostOrderSource $source,
    ): SendHostKeysCommand {
        return new SendHostKeysCommand(
            $this->process->id,
            $bytes,
            $rows->guardOn($frame),
            $this->process->refresh()->input_generation,
            $source,
        );
    }

    private function sourceOf(ClaimedRequest $request, string $step): HostOrderSource
    {
        return HostOrderSource::forStep($request->requestId, $step, $request->attempt, $this->generation);
    }

    private function progress(ClaimedRequest $request, RequestProgress $progress): NotifyRequestProgressCommand
    {
        return new NotifyRequestProgressCommand(
            $this->process->host_id,
            $request->requestId,
            $request->attempt,
            $progress,
            null,
            null,
        );
    }

    private function endReport(string $requestId, int $attempt, TurnEnd $end): NotifyRequestProgressCommand
    {
        return new NotifyRequestProgressCommand(
            $this->process->host_id,
            $requestId,
            $attempt,
            $end->progress(),
            null,
            $end->outcome(),
            turnEnd: $end,
        );
    }

    /**
     * What the runtime is doing now, under its process generation as it stands, so a terminal its host healed after a
     * crash reports under the generation of the process it now draws.
     */
    private function activity(RuntimeActivity $activity, HoldReason $hold): NotifyRuntimeActivityCommand
    {
        $runtime = AgentRuntime::query()->whereKey($this->process->agent_runtime_id);

        return new NotifyRuntimeActivityCommand(
            $this->process->host_id,
            (string) $this->process->agent_runtime_id,
            $activity,
            $hold,
            (int) $runtime->value('process_generation'),
        );
    }

    private function snapshot(): TakeHostProcessSnapshotCommand
    {
        return new TakeHostProcessSnapshotCommand($this->process->id, HostOrderSource::forWorker($this->generation));
    }
}
