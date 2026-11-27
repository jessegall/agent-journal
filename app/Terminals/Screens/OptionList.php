<?php

declare(strict_types=1);

namespace App\Terminals\Screens;

use App\Hosts\Protocol\Data\HostFrameData;
use App\Terminals\Screens\Contracts\MenuRegion;

/**
 * The lowest list of menu options on the screen: a row that starts with one of the highlight markers after its
 * indent, with at least one more option row beside it whose text starts at the same column. It is found by its shape,
 * not by its words, so a reworded menu is still found; a prompt row with no options beside it is not a list.
 */
final readonly class OptionList implements MenuRegion
{
    private const int FEWEST_OPTIONS = 2;

    /**
     * @param  list<string>  $markers
     */
    public function __construct(private string $label, public array $markers) {}

    public function name(): string
    {
        return $this->label;
    }

    public function rowsOf(HostFrameData $frame): RowRange|null
    {
        $rows = array_map(fn (string $text) => new ScreenRow($text), $frame->rows);

        for ($row = count($rows) - 1; $row >= 0; $row--) {
            $column = $this->textColumnOf($rows[$row]);

            if ($column === null) {
                continue;
            }

            $first = $row;
            $last = $row + 1;

            while ($first > 0 && self::isOptionAt($rows[$first - 1], $column)) {
                $first--;
            }

            while ($last < count($rows) && self::isOptionAt($rows[$last], $column)) {
                $last++;
            }

            if ($last - $first >= self::FEWEST_OPTIONS) {
                return new RowRange($first, $last);
            }
        }

        return null;
    }

    /**
     * Each option's text from the column after the highlight marker, and which option is highlighted.
     */
    public function entriesOf(HostFrameData $frame): MenuEntries|null
    {
        $range = $this->rowsOf($frame);

        if ($range === null) {
            return null;
        }

        $rows = array_map(fn (int $row) => new ScreenRow($frame->rows[$row]), $range->rows());
        $highlighted = 0;
        $column = 0;

        foreach ($rows as $index => $row) {
            $found = $this->textColumnOf($row);

            if ($found !== null) {
                $highlighted = $index;
                $column = $found;
            }
        }

        $labels = array_map(fn (ScreenRow $row) => trim(mb_substr($row->text, $column)), $rows);

        return new MenuEntries($labels, $highlighted);
    }

    /**
     * The column the highlighted option's text starts at, after the row's indent and its marker; none for a row with
     * no highlight marker followed by text.
     */
    private function textColumnOf(ScreenRow $row): int|null
    {
        $trimmed = ltrim($row->text, ' ');
        $indent = strlen($row->text) - strlen($trimmed);

        foreach ($this->markers as $marker) {
            if (str_starts_with($trimmed, $marker) && trim(substr($trimmed, strlen($marker))) !== '') {
                return $indent + mb_strlen($marker);
            }
        }

        return null;
    }

    /**
     * Whether the row is an option beside the highlighted one: nothing but spaces before the column, text at it.
     */
    private static function isOptionAt(ScreenRow $row, int $column): bool
    {
        return strlen($row->text) > $column
            && ltrim(substr($row->text, 0, $column), ' ') === ''
            && $row->text[$column] !== ' ';
    }
}
