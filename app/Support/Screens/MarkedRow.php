<?php

declare(strict_types=1);

namespace App\Support\Screens;

use App\Contracts\Screens\ScreenRegion;
use App\Data\Hosts\HostFrameData;

/**
 * The lowest row that starts with one of its prefixes and holds its text, at most the rows given above the last drawn
 * row when they are given, as a driver draws its spinner or its status line.
 */
final readonly class MarkedRow implements ScreenRegion
{
    /**
     * @param  list<string>  $prefixes
     */
    public function __construct(
        private string $label,
        private array $prefixes,
        private string $text,
        private int|null $rowsBelow = null,
    ) {}

    public function name(): string
    {
        return $this->label;
    }

    public function rowsOf(HostFrameData $frame): RowRange|null
    {
        $rows = array_map(fn (string $text) => new ScreenRow($text), $frame->rows);
        $drawn = array_keys(array_filter($rows, fn (ScreenRow $row) => ! $row->isBlank()));
        $lastDrawn = $drawn === [] ? -1 : max($drawn);
        $highest = $this->rowsBelow === null ? 0 : max(0, $lastDrawn - $this->rowsBelow);

        for ($row = $lastDrawn; $row >= $highest; $row--) {
            if ($this->isMarked($rows[$row])) {
                return new RowRange($row, $row + 1);
            }
        }

        return null;
    }

    private function isMarked(ScreenRow $row): bool
    {
        if (! str_contains($row->text, $this->text)) {
            return false;
        }

        return $this->prefixes === [] || array_any($this->prefixes, fn (string $prefix) => $row->startsWith($prefix));
    }
}
