<?php

declare(strict_types=1);

namespace App\Values;

/**
 * Where the words matched in a record's long text: the segment that was read, the column in it where the match
 * starts, the character offset of that start in the whole text, and its line there, from 1.
 */
final readonly class BodyMatch
{
    public function __construct(
        public string $segment,
        public int $column,
        public int $characterOffset,
        public int $line,
    ) {}

    /**
     * The excerpt a hit shows: the match with the given number of characters before it, cut to a snippet's length.
     */
    public function snippet(int $contextCharacters): string
    {
        return mb_substr(
            $this->segment,
            max(0, $this->column - $contextCharacters),
            SearchResult::SNIPPET_CHARACTER_LIMIT,
        );
    }
}
