<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\HoldReason;
use App\Files\Contracts\Files;
use App\Hosts\Protocol\Payloads\HostFramePayload;
use App\Terminals\Screens\Enums\ScreenType;
use App\Terminals\Screens\ScreenClassifier;
use App\Terminals\Screens\ScreenHolds;
use App\Terminals\Screens\ScreenReading;
use Tests\Support\Recordings\TerminalCapture;
use Tests\TestCase;

/**
 * The journal reads Codex's screen as the pinned build was recorded drawing it: its first start ready at the composer,
 * the background server's question and the pickers of its key scripts as their families, and a reworded menu still as its family, holding for its user.
 */
final class CodexScreensTest extends TestCase
{
    private const int COLUMNS = 120;

    private const int ROWS = 24;

    public function test_a_first_start_reads_as_ready_at_its_composer(): void
    {
        $frames = $this->framesOf('first-start');

        $this->journal->assertResult(ScreenType::PromptReady, $this->readingOf($frames[array_key_last($frames)])->type);
    }

    public function test_the_pickers_a_key_script_passes_read_as_their_families(): void
    {
        $families = [];

        foreach ([
            ...$this->framesOf('model-choice'),
            ...$this->framesOf('effort-change'),
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

    private function readingOf(HostFramePayload $frame): ScreenReading
    {
        $layout = $this->journal->driverProfile(DefaultDrivers::CODEX)->layout();

        return new ScreenClassifier()->readingOf($layout, $frame);
    }

    /**
     * @return list<HostFramePayload>
     */
    private function framesOf(string $recording): array
    {
        $path = TerminalCapture::folderOf(DefaultDrivers::CODEX, $recording)->child('frames.json');
        $frames = $this->journal->service(Files::class)->readJson($path);

        return array_map(fn (array $frame) => HostFramePayload::from($frame['frame']), $frames);
    }

    /**
     * @param  list<string>  $drawn
     */
    private function frame(array $drawn, int $unchangedMs, int $cursorRow = 0, int $cursorColumn = 0): HostFramePayload
    {
        $rows = array_pad($drawn, self::ROWS, '');

        return HostFramePayload::from([
            'rows' => $rows,
            'cursor_row' => $cursorRow,
            'cursor_column' => $cursorColumn,
            'columns' => self::COLUMNS,
            'buffer' => 'normal',
            'captured' => 1_000,
            'unchanged_ms' => array_fill(0, self::ROWS, $unchangedMs),
            'buffer' => 'alternate',
        ]);
    }
}
