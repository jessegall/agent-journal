<?php

declare(strict_types=1);

namespace App\Support\Screens;

use App\Contracts\Screens\ScreenRegion;
use App\Data\Hosts\HostFrameData;

/**
 * The lowest row that starts with its marker and sits directly between two rule rows, as Claude Code draws its
 * composer: a rule above, the prompt row, a rule below. Text that merely looks like the prompt is not fenced.
 */
final readonly class FencedRow implements ScreenRegion
{
    public function __construct(private string $label, private string $marker) {}

    public function name(): string
    {
        return $this->label;
    }

    public function rowsOf(HostFrameData $frame): RowRange|null
    {
        $rows = array_map(fn (string $text) => new ScreenRow($text), $frame->rows);

        for ($row = count($rows) - 2; $row >= 1; $row--) {
            if ($rows[$row]->startsWith($this->marker) && $rows[$row - 1]->isRule() && $rows[$row + 1]->isRule()) {
                return new RowRange($row, $row + 1);
            }
        }

        return null;
    }
}
