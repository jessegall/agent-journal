<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Handbook\Support;

use Tests\Fixtures\Modules\Handbook\Exceptions\HandbookEntryMissing;
use Tests\Fixtures\Modules\Handbook\Values\HandbookEntry;

/**
 * The handbook's entries, numbered per owner, with their texts and references kept apart from their headers, and a
 * count of each kind of read so a test can measure what a page asked for.
 */
final class HandbookEntries
{
    public bool $isReadable = true;

    public int $headerReads = 0;

    public int $textReads = 0;

    public int $referenceReads = 0;

    /**
     * @var array<string, array<int, HandbookEntry>> by owner id, then number
     */
    private array $headers = [];

    /**
     * @var array<string, array<int, string>> by owner id, then number
     */
    private array $texts = [];

    /**
     * @var array<string, array<int, list<int>>> the numbers each entry refers to, by owner id, then number
     */
    private array $references = [];

    /**
     * @param  list<int>  $references
     */
    public function add(HandbookEntry $entry, string $text, array $references = []): void
    {
        $this->headers[$entry->ownerId][$entry->number] = $entry;
        $this->texts[$entry->ownerId][$entry->number] = $text;
        $this->references[$entry->ownerId][$entry->number] = $references;
    }

    /**
     * The owner's entry with that number; another owner's entry of the same number is not theirs.
     */
    public function visibleTo(string $ownerId, int $number): HandbookEntry
    {
        $this->headerReads++;

        return $this->headers[$ownerId][$number] ?? throw HandbookEntryMissing::forNumber((string) $number);
    }

    /**
     * The start of the entry's text up to the byte limit, cut at the last paragraph break inside it, or at the limit
     * when the first paragraph alone is longer.
     */
    public function textSlice(HandbookEntry $entry, int $byteLimit): string
    {
        $this->textReads++;
        $text = $this->texts[$entry->ownerId][$entry->number];

        if (strlen($text) <= $byteLimit) {
            return $text;
        }

        $slice = mb_strcut($text, 0, $byteLimit);
        $paragraphEnd = strrpos($slice, "\n\n");

        return $paragraphEnd === false ? $slice : substr($slice, 0, $paragraphEnd);
    }

    /**
     * A page of the entries this one refers to that belong to the same owner, from the cursor on.
     *
     * @return list<HandbookEntry>
     */
    public function referencePage(HandbookEntry $entry, int $cursor, int $pageSize): array
    {
        $this->referenceReads++;
        $visible = array_values(array_filter(
            $this->references[$entry->ownerId][$entry->number],
            fn (int $number) => isset($this->headers[$entry->ownerId][$number]),
        ));

        return array_map(
            fn (int $number) => $this->headers[$entry->ownerId][$number],
            array_slice($visible, $cursor, $pageSize),
        );
    }

    /**
     * How many of the entry's references belong to the same owner.
     */
    public function referenceCount(HandbookEntry $entry): int
    {
        return count(array_filter(
            $this->references[$entry->ownerId][$entry->number],
            fn (int $number) => isset($this->headers[$entry->ownerId][$number]),
        ));
    }
}
