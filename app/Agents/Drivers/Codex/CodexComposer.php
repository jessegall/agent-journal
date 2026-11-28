<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Hosts\Protocol\Payloads\HostFramePayload;
use App\Terminals\Screens\Contracts\ScreenRegion;
use App\Terminals\Screens\MarkedRow;
use App\Terminals\Screens\RowRange;
use App\Terminals\Screens\ScreenRow;

/**
 * Codex draws the prompt marker on the first composer row and indents its continuation rows.
 */
final readonly class CodexComposer implements ScreenRegion
{
    private const string PROMPT = '› ';

    private const string INDENT = '  ';

    private const int FOOTER_ROWS = 3;

    public const int EMPTY_CURSOR_COLUMN = 2;

    public function name(): string
    {
        return 'composer';
    }

    public function rowsOf(HostFramePayload $frame): RowRange|null
    {
        $composer = $this->endingAtCursor($frame);

        if ($composer !== null) {
            return $composer;
        }

        return new MarkedRow($this->name(), [self::PROMPT], [], self::FOOTER_ROWS)->rowsOf($frame);
    }

    private function endingAtCursor(HostFramePayload $frame): RowRange|null
    {
        $cursor = $frame->cursorRow;

        if ($frame->cursorColumn < self::EMPTY_CURSOR_COLUMN || $cursor < 0 || $cursor >= count($frame->rows)) {
            return null;
        }

        $belowFooter = array_slice($frame->rows, $cursor + self::FOOTER_ROWS + 1);

        if (array_any($belowFooter, fn (string $line) => ! new ScreenRow($line)->isBlank())) {
            return null;
        }

        for ($row = $cursor; $row >= 0; $row--) {
            $line = new ScreenRow($frame->rows[$row]);

            if ($line->startsWith(self::PROMPT)) {
                return new RowRange($row, $cursor + 1);
            }

            if ($line->isBlank() || ! $line->startsWith(self::INDENT)) {
                return null;
            }
        }

        return null;
    }
}
