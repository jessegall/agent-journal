<?php

declare(strict_types=1);

namespace App\Support\KeyScripts;

use App\Contracts\Hosts\HostChannel;
use App\Contracts\Screens\MenuRegion;
use App\Data\Hosts\HostFrameData;
use App\Enums\Navigation\NavigationKey;
use App\Enums\Navigation\NavigationReason;
use App\Enums\Screens\KeyAction;
use App\Enums\Screens\ScreenType;
use App\Support\Screens\MenuEntries;
use App\Support\Screens\RowRange;
use App\Support\Screens\ScreenClassifier;
use App\Support\Screens\ScreenFingerprint;
use App\Support\Screens\ScreenLayout;
use App\Support\Screens\ScreenReading;
use App\Values\HostOrderSource;

/**
 * Drives a driver's menus with a key script, one frame at a time: a key goes only after the screen its step expects
 * is read, an entry is found by its label and reached from the highlight one confirmed arrow at a time, and Enter
 * goes only once the highlight is on it. A screen it cannot be certain of stops the run without a key.
 */
final readonly class KeyScriptRunner
{
    public function __construct(
        private ScreenClassifier $classifier,
        private HostChannel $host,
        private ScreenFingerprint $fingerprints,
    ) {}

    /**
     * What the run does on the frame, with the run as it stands after it. A shielded frame is never acted on.
     */
    public function moveOn(ScreenLayout $layout, KeyScriptRun $run, HostFrameData $frame): KeyMove
    {
        if ($run->isFinished()) {
            return KeyMove::finished($run);
        }

        return $this->onStep($layout, $run->withStepStarted($frame->captured), $frame);
    }

    /**
     * The move of a run whose step has begun.
     */
    private function onStep(ScreenLayout $layout, KeyScriptRun $run, HostFrameData $frame): KeyMove
    {
        if ($frame->isShielded) {
            return KeyMove::failed($run);
        }

        $step = $run->currentStep();
        $reading = $this->classifier->readingOf($layout, $frame);

        $fingerprint = $step->expectation->fingerprint === null
            ? null
            : $this->fingerprints->of($layout, $run->script->driver, $frame, $reading->menu?->name);

        if (! $step->expectation->isMetBy($reading, $frame, $run->values, $fingerprint)) {
            return self::unmet($run, $reading, $frame);
        }

        return match ($step->action) {
            KeyAction::WaitForScreen => $this->moveOn($layout, $run->advanced($frame->captured), $frame),
            KeyAction::PressKeys => KeyMove::send(
                $run->advanced($frame->captured),
                $step->keys,
                self::guardedRows($layout, $reading, $frame),
            ),
            KeyAction::SelectEntry,
            KeyAction::ChooseEntry,
            KeyAction::ConfirmEntry => $this->towardsEntry($layout, $run, $reading, $frame),
        };
    }

    /**
     * Sends a move's keys to the process, guarded by the rows they were read on, so the host refuses them once those
     * rows or the user's input moved on.
     */
    public function send(
        KeyMove $move,
        HostFrameData $frame,
        string $processId,
        int $inputGeneration,
        HostOrderSource $source,
    ): string {
        $guard = $move->guardOn($frame);

        return $this->host->keys($processId, $move->keys, $guard, $inputGeneration, $source);
    }

    /**
     * A step whose screen has not come: it waits until its deadline, then a still menu, known or not, leaves the run
     * for the main agent to navigate, and any other screen fails it.
     */
    private static function unmet(KeyScriptRun $run, ScreenReading $reading, HostFrameData $frame): KeyMove
    {
        if (! $run->isOverdue($frame->captured)) {
            return KeyMove::wait($run);
        }

        $isMenu = $reading->type === ScreenType::Menu;
        $isPickable = $isMenu || ($reading->type === ScreenType::Unknown && $reading->hasOptions);

        if ($reading->isStill && $isPickable) {
            return KeyMove::uncertain($run, NavigationReason::NoEntry);
        }

        return KeyMove::failed($run);
    }

    /**
     * One arrow towards the step's entry, or, once the highlight is on it, the step done: Enter for a choice.
     */
    private function towardsEntry(
        ScreenLayout $layout,
        KeyScriptRun $run,
        ScreenReading $reading,
        HostFrameData $frame,
    ): KeyMove {
        $menu = self::menuOf($layout, $reading, $frame);
        $waiting = KeyMove::wait($run);

        if ($menu === null) {
            return $waiting;
        }

        [$entries, $rows] = $menu;

        // A sent arrow is drawn once the highlight left the entry it was sent from.
        if ($run->highlightBefore !== null && $entries->highlightedLabel() === $run->highlightBefore) {
            return $waiting;
        }

        return $this->fromHighlight($layout, $run->moved(), $entries, $rows, $frame);
    }

    /**
     * One arrow from the highlighted entry towards the step's entry, or the step done once the highlight is on it.
     */
    private function fromHighlight(
        ScreenLayout $layout,
        KeyScriptRun $run,
        MenuEntries $entries,
        RowRange $rows,
        HostFrameData $frame,
    ): KeyMove {
        $step = $run->currentStep();
        $targets = $step->targetsIn($entries, $run->values);

        if ($targets === []) {
            return KeyMove::uncertain($run, NavigationReason::LabelMissing);
        }

        if (count($targets) > 1) {
            return KeyMove::uncertain($run, NavigationReason::Ambiguous);
        }

        $distance = $targets[0] - $entries->highlighted;

        $isChoice = in_array($step->action, [KeyAction::ChooseEntry, KeyAction::ConfirmEntry], true);

        if ($step->action === KeyAction::ConfirmEntry && $distance !== 0) {
            return KeyMove::uncertain($run, NavigationReason::HighlightWrong);
        }

        if ($distance !== 0) {
            $awaiting = $run->awaitingMoveFrom($entries->highlightedLabel());

            return KeyMove::send($awaiting, self::arrowOf($entries, $distance), $rows);
        }

        if ($isChoice) {
            return KeyMove::send($run->advanced($frame->captured), NavigationKey::Enter->bytes(), $rows);
        }

        return $this->moveOn($layout, $run->advanced($frame->captured), $frame);
    }

    /**
     * The entries of the menu on screen and the rows they take: a known family's own, such as a slider's, or else the
     * layout's option list, so a menu no family knows is read too.
     *
     * @return array{MenuEntries, RowRange}|null
     */
    private static function menuOf(ScreenLayout $layout, ScreenReading $reading, HostFrameData $frame): array|null
    {
        $region = $reading->menu?->options;

        if (! $region instanceof MenuRegion) {
            $region = $layout->optionList();
        }

        $entries = $region->entriesOf($frame);
        $rows = $region->rowsOf($frame);

        if ($entries === null || $rows === null) {
            return null;
        }

        return [
            $entries,
            $rows,
        ];
    }

    private static function arrowOf(MenuEntries $entries, int $distance): string
    {
        if ($entries->isAcross) {
            if ($distance > 0) {
                return NavigationKey::Right->bytes();
            }

            return NavigationKey::Left->bytes();
        }

        if ($distance > 0) {
            return NavigationKey::Down->bytes();
        }

        return NavigationKey::Up->bytes();
    }

    /**
     * The rows a key is read on: the menu's options, or the composer, or else the whole screen.
     */
    private static function guardedRows(ScreenLayout $layout, ScreenReading $reading, HostFrameData $frame): RowRange
    {
        return $reading->menuRowsOf($frame)
            ?? $layout->composer->rowsOf($frame)
            ?? new RowRange(0, count($frame->rows));
    }
}
