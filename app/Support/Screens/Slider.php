<?php

declare(strict_types=1);

namespace App\Support\Screens;

use App\Contracts\Screens\MenuRegion;
use App\Data\Hosts\HostFrameData;

/**
 * A horizontal scale of choices, as Claude Code draws its effort picker: a bar of ─ with one marker on it, and right
 * below it a row of at least two labels.
 */
final readonly class Slider implements MenuRegion
{
    private const string BAR = '─';

    private const int SHORTEST_BAR = 10;

    private const int FEWEST_LABELS = 2;

    public function __construct(private string $label, private string $marker) {}

    public function name(): string
    {
        return $this->label;
    }

    public function rowsOf(HostFrameData $frame): RowRange|null
    {
        $rows = array_map(fn (string $text) => new ScreenRow($text), $frame->rows);

        for ($row = count($rows) - 2; $row >= 0; $row--) {
            if ($this->isBar($rows[$row]) && self::labelCountOf($rows[$row + 1]) >= self::FEWEST_LABELS) {
                return new RowRange($row, $row + 2);
            }
        }

        return null;
    }

    /**
     * The labels below the bar, left to right, that start within its columns, and the one nearest the marker; a label
     * past the bar, such as a key hint, is no choice.
     */
    public function entriesOf(HostFrameData $frame): MenuEntries|null
    {
        $range = $this->rowsOf($frame);

        if ($range === null) {
            return null;
        }

        $bar = mb_str_split(new ScreenRow($frame->rows[$range->first])->text);

        $onBar = array_keys(array_filter(
            $bar,
            fn (string $character) => in_array($character, [
                self::BAR,
                $this->marker,
            ], true),
        ));

        $marker = (int) array_search($this->marker, $bar, true);

        $barStart = min([
            $marker,
            ...$onBar,
        ]);

        $barEnd = max([
            $marker,
            ...$onBar,
        ]);

        $below = new ScreenRow($frame->rows[$range->first + 1])->text;
        preg_match_all('/\S+/u', $below, $words, PREG_OFFSET_CAPTURE);
        $labels = [];
        $nearest = 0;
        $nearestDistance = PHP_INT_MAX;

        foreach ($words[0] as [$word, $offset]) {
            $start = mb_strlen(substr($below, 0, $offset));
            $end = $start + mb_strlen($word) - 1;

            if ($start < $barStart || $start > $barEnd) {
                continue;
            }

            $distance = max(0, $start - $marker, $marker - $end);

            if ($distance < $nearestDistance) {
                $nearest = count($labels);
                $nearestDistance = $distance;
            }

            $labels[] = $word;
        }

        if ($labels === []) {
            return null;
        }

        return new MenuEntries($labels, $nearest, isAcross: true);
    }

    /**
     * Whether the row holds the marker once, on a bar of ─ that spans at least the shortest bar's columns.
     */
    private function isBar(ScreenRow $row): bool
    {
        if (mb_strlen($this->marker) !== 1 || mb_substr_count($row->text, $this->marker) !== 1) {
            return false;
        }

        $columns = array_keys(array_filter(
            mb_str_split($row->text),
            fn (string $character) => $character === self::BAR || $character === $this->marker,
        ));

        return $columns !== [] && max($columns) - min($columns) >= self::SHORTEST_BAR;
    }

    private static function labelCountOf(ScreenRow $row): int
    {
        return count(preg_split('/ +/', trim($row->text), -1, PREG_SPLIT_NO_EMPTY) ?: []);
    }
}
