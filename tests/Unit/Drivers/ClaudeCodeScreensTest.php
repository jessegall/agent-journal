<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\HoldReason;
use App\Hosts\Protocol\Payloads\HostFramePayload;
use App\Terminals\KeyScripts\KeyScriptCatalogue;
use App\Terminals\KeyScripts\KeyScriptRun;
use App\Terminals\KeyScripts\KeyScriptRunner;
use App\Terminals\Screens\Enums\KeyMoveType;
use App\Terminals\Screens\Enums\ScreenType;
use App\Terminals\Screens\ScreenClassifier;
use App\Terminals\Screens\ScreenHolds;
use App\Terminals\Screens\ScreenReading;
use Tests\TestCase;

/**
 * The journal reads Claude Code's screen as the pinned build was recorded drawing it: each recorded screen as its
 * menu, a reworded menu still as its family, and a screen still only once each of its rows held, by the host's clock,
 * for the layout's interval.
 */
final class ClaudeCodeScreensTest extends TestCase
{
    private const string SCREENS = __DIR__.'/../../../resources/recordings/claude-code/2.1.323/screens';

    private const int COLUMNS = 120;

    private const int ROWS = 24;

    public function test_each_recorded_screen_reads_as_its_menu(): void
    {
        $recorded = [
            'folder-trust' => 'folder-trust',
            'welcome-theme' => 'theme',
            'welcome-theme-accepted' => 'login-method',
            'folded-paste' => null,
        ];

        $read = array_map(fn (string $name) => $this->readingOf($this->lastFrameOf($name))->menu?->name, array_keys($recorded));

        $this->journal->assertResult(array_values($recorded), $read);
    }

    /**
     * An applied effort change leaves its echoed command and its answer above a ready composer, which read like a
     * menu's options and its words; a menu is never open above a drawn composer, so the screen takes the next prompt.
     */
    public function test_a_menu_above_a_drawn_composer_is_conversation_and_the_composer_is_ready(): void
    {
        $reading = $this->readingOf($this->lastFrameOf('effort-applied'));

        $this->journal->assertResult([ScreenType::PromptReady, true], [$reading->type, $reading->isStill]);
    }

    /**
     * Right after Enter on /model the echoed line shows with no composer and no options to choose, so a script waits
     * for the switch dialog; the dialog then offers its options, among them the one the script chooses.
     */
    public function test_the_model_echo_offers_nothing_to_choose_and_the_switch_dialog_does(): void
    {
        $echo = $this->readingOf($this->lastFrameOf('model-echo'));
        $switch = $this->readingOf($this->lastFrameOf('model-switch'));

        $this->journal->assertResult(
            [null, false, true],
            [$echo->menu?->name, $echo->hasOptions, $switch->hasOptions],
        );
    }

    /**
     * Claude Code asks before it switches the model of a conversation that began, and not of a fresh one: the model
     * script presses Enter on the asked question, and without it passes the step over to the proof that it applied.
     */
    public function test_the_model_switch_is_confirmed_when_asked_and_passed_over_when_not(): void
    {
        $profile = $this->journal->driverProfile(DefaultDrivers::CLAUDE_CODE);
        $runner = $this->journal->service(KeyScriptRunner::class);
        $script = new KeyScriptCatalogue($profile->keyScripts())
            ->scriptFor(DefaultDrivers::CLAUDE_CODE, '2.1.332', 'ChangeModel');
        $atTheQuestion = new KeyScriptRun($script, ['model' => 'claude-sonnet-5-5'], step: 2);

        $asked = $runner->moveOn($profile->layout(), $atTheQuestion, $this->lastFrameOf('model-switch'));
        $notAsked = $runner->moveOn($profile->layout(), $atTheQuestion, $this->lastFrameOf('model-applied'));

        $this->journal->assertResult(
            [KeyMoveType::Send, "\r", KeyMoveType::Finished],
            [$asked->type, $asked->keys, $notAsked->type],
        );
    }

    public function test_a_reworded_menu_still_reads_as_its_family_and_holds_for_it(): void
    {
        $frame = $this->frame(['SECURITY first: do you Trust what is here?', '', ' ❯ No, exit', '   Yes, go on'], 400);

        $reading = $this->readingOf($frame);
        $hold = new ScreenHolds()->holdOf($reading);

        $this->journal->assertResult(
            [ScreenType::Menu, 'folder-trust', true, HoldReason::TrustRequired],
            [$reading->type, $reading->menu?->name, $reading->isStill, $hold->reason],
        );
    }

    public function test_a_menu_is_still_only_once_each_of_its_rows_held_by_the_hosts_clock(): void
    {
        $rows = ['Choose the text style', '', ' ❯ ✔ Dark mode', '     Light mode', '     Dark mode (colorblind-friendly)'];
        $redrawing = $this->frame($rows, 100);
        $late = $this->frame($rows, 0, captured: 900_000);
        $held = $this->frame($rows, 300);

        $this->journal->assertResult(
            [false, false, true, "\r"],
            [
                $this->readingOf($redrawing)->isStill,
                $this->readingOf($late)->isStill,
                $this->readingOf($held)->isStill,
                new ScreenHolds()->holdOf($this->readingOf($held))->answer,
            ],
        );
    }

    public function test_an_empty_composer_reads_as_ready_and_a_draft_does_not(): void
    {
        $rule = str_repeat('─', 40);
        $empty = $this->frame(['', $rule, '❯ ', $rule], 300, cursorRow: 2, cursorColumn: 2);
        $draft = $this->frame(['', $rule, '❯ hello', $rule], 300, cursorRow: 2, cursorColumn: 7);

        $this->journal->assertResult(
            [ScreenType::PromptReady, true, ScreenType::Unknown, HoldReason::UnknownScreen, true],
            [
                $this->readingOf($empty)->type,
                $this->readingOf($empty)->isStill,
                $this->readingOf($draft)->type,
                new ScreenHolds()->holdOf($this->readingOf($draft))->reason,
                $this->journal->driverProfile(DefaultDrivers::CLAUDE_CODE)->layout()->menus[3]->isSecret,
            ],
        );
    }

    private function readingOf(HostFramePayload $frame): ScreenReading
    {
        $layout = $this->journal->driverProfile(DefaultDrivers::CLAUDE_CODE)->layout();

        return new ScreenClassifier()->readingOf($layout, $frame);
    }

    private function lastFrameOf(string $name): HostFramePayload
    {
        $frames = json_decode((string) file_get_contents(self::SCREENS."/{$name}/frames.json"), true, flags: JSON_THROW_ON_ERROR);

        return HostFramePayload::from($frames[array_key_last($frames)]['frame']);
    }

    /**
     * @param  list<string>  $drawn
     */
    private function frame(
        array $drawn,
        int $unchangedMs,
        int $cursorRow = 0,
        int $cursorColumn = 0,
        int $captured = 1_000,
    ): HostFramePayload {
        $rows = array_pad($drawn, self::ROWS, '');

        return HostFramePayload::from([
            'rows' => $rows,
            'cursor_row' => $cursorRow,
            'cursor_column' => $cursorColumn,
            'columns' => self::COLUMNS,
            'buffer' => 'normal',
            'captured' => $captured,
            'unchanged_ms' => array_fill(0, self::ROWS, $unchangedMs),
        ]);
    }
}
