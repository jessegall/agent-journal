<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\DefaultDrivers;
use App\Data\Hosts\HostFrameData;
use App\Enums\Drivers\HoldReason;
use App\Enums\Screens\ScreenType;
use App\Support\Screens\ScreenClassifier;
use App\Support\Screens\ScreenHolds;
use App\Support\Screens\ScreenReading;
use Tests\TestCase;

/**
 * The journal reads Codex's screen as the pinned build was recorded drawing it: its first start ready at the composer,
 * the background server's question and the pickers of its key scripts as their families, and a reworded menu still as its family, holding for its user.
 */
final class CodexScreensTest extends TestCase
{
    private const string RECORDINGS = __DIR__.'/../../../resources/recordings/codex/0.165.0';

    private const int COLUMNS = 120;

    private const int ROWS = 24;

    public function test_a_first_start_reads_as_ready_at_its_composer(): void
    {
        $frames = $this->framesOf('screens/first-start');

        $this->journal->assertResult(ScreenType::PromptReady, $this->readingOf($frames[array_key_last($frames)])->type);
    }

    public function test_the_pickers_a_key_script_passes_read_as_their_families(): void
    {
        $families = [];

        foreach ([
            ...$this->framesOf('keyscripts/model-choice'),
            ...$this->framesOf('keyscripts/effort-change'),
        ] as $frame) {
            $families[] = $this->readingOf($frame)->menu?->name;
        }

        $seen = array_values(array_unique(array_filter($families)));
        sort($seen);

        $this->journal->assertResult(['background-server', 'model-picker', 'reasoning-picker'], $seen);
    }

    public function test_a_reworded_menu_still_reads_as_its_family_and_holds_for_it(): void
    {
        $frame = $this->frame([
            'Do you TRUST THIS FOLDER? Its folder settings load.',
            '',
            '› 1. Yes, trust and continue',
            '  2. No, quit',
        ], 400);

        $reading = $this->readingOf($frame);

        $this->journal->assertResult(
            [ScreenType::Menu, 'folder-trust', true, HoldReason::TrustRequired],
            [$reading->type, $reading->menu?->name, $reading->isStill, new ScreenHolds()->holdOf($reading)->reason],
        );
    }

    public function test_an_empty_composer_reads_as_ready_and_a_draft_does_not(): void
    {
        $empty = $this->frame([
            '',
            '› Ask Codex to do anything',
            '',
            '  ? for shortcuts',
        ], 300, cursorRow: 1, cursorColumn: 2);
        $draft = $this->frame(['', '› hello', '', '  ? for shortcuts'], 300, cursorRow: 1, cursorColumn: 7);

        $this->journal->assertResult(
            [ScreenType::PromptReady, ScreenType::Unknown],
            [$this->readingOf($empty)->type, $this->readingOf($draft)->type],
        );
    }

    private function readingOf(HostFrameData $frame): ScreenReading
    {
        $layout = $this->journal->driverProfile(DefaultDrivers::CODEX)->layout();

        return new ScreenClassifier()->readingOf($layout, $frame);
    }

    /**
     * @return list<HostFrameData>
     */
    private function framesOf(string $recording): array
    {
        $frames = json_decode(
            (string) file_get_contents(self::RECORDINGS."/{$recording}/frames.json"),
            true,
            flags: JSON_THROW_ON_ERROR,
        );

        return array_map(fn (array $frame) => HostFrameData::from($frame['frame']), $frames);
    }

    /**
     * @param  list<string>  $drawn
     */
    private function frame(array $drawn, int $unchangedMs, int $cursorRow = 0, int $cursorColumn = 0): HostFrameData
    {
        $rows = array_pad($drawn, self::ROWS, '');

        return HostFrameData::from([
            'rows' => $rows,
            'cursor_row' => $cursorRow,
            'cursor_column' => $cursorColumn,
            'columns' => self::COLUMNS,
            'captured' => 1_000,
            'unchanged_ms' => array_fill(0, self::ROWS, $unchangedMs),
            'buffer' => 'alternate',
        ]);
    }
}
