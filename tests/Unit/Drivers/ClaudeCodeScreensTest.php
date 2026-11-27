<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\HoldReason;
use App\Hosts\Protocol\Data\HostFrameData;
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

    private function readingOf(HostFrameData $frame): ScreenReading
    {
        $layout = $this->journal->driverProfile(DefaultDrivers::CLAUDE_CODE)->layout();

        return new ScreenClassifier()->readingOf($layout, $frame);
    }

    private function lastFrameOf(string $name): HostFrameData
    {
        $frames = json_decode((string) file_get_contents(self::SCREENS."/{$name}/frames.json"), true, flags: JSON_THROW_ON_ERROR);

        return HostFrameData::from($frames[array_key_last($frames)]['frame']);
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
    ): HostFrameData {
        $rows = array_pad($drawn, self::ROWS, '');

        return HostFrameData::from([
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
