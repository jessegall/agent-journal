<?php

declare(strict_types=1);

namespace App\Support\Screens;

/**
 * The entries a menu shows, top to bottom or left to right, and the index of the highlighted one; a menu laid out
 * across, such as a slider, is moved with the side arrows.
 */
final readonly class MenuEntries
{
    /**
     * The "3. " a driver puts before an entry's label.
     */
    private const string NUMBER = '/^\d+\.\s+/';

    /**
     * @param  list<string>  $labels
     */
    public function __construct(public array $labels, public int $highlighted, public bool $isAcross = false) {}

    /**
     * The entries whose label is the given one, in any case, so a caller can tell none from two and never takes a
     * neighbour. An entry's label is its first column, after its number and up to the gap of two spaces before its
     * description, with or without a note such as "(current)".
     *
     * @return list<int>
     */
    public function indicesOf(string $label): array
    {
        return array_keys(array_filter($this->labels, fn (string $text) => self::isLabelled($text, $label)));
    }

    /**
     * The entries carrying the note, such as "(current)".
     *
     * @return list<int>
     */
    public function indicesMarked(string $note): array
    {
        return array_keys(array_filter($this->labels, fn (string $text) => str_contains($text, $note)));
    }

    public function highlightedLabel(): string
    {
        return $this->labels[$this->highlighted];
    }

    private static function isLabelled(string $text, string $label): bool
    {
        $column = explode('  ', (string) preg_replace(self::NUMBER, '', $text), 2)[0];

        if (strcasecmp($column, $label) === 0) {
            return true;
        }

        $length = strlen($label);

        if (strlen($column) <= $length + 1 || $column[$length] !== ' ' || strncasecmp($column, $label, $length) !== 0) {
            return false;
        }

        // What follows the label is a note, never more of a word: "Opus" is not the label of "Opus 5.5".
        return preg_match('/^[\p{L}\p{N}]/u', substr($column, $length + 1)) !== 1;
    }
}
