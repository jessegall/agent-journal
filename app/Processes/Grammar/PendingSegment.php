<?php

declare(strict_types=1);

namespace App\Processes\Grammar;

use App\Processes\Grammar\Values\WordSegment;

/**
 * One segment of a word still to search for substitutions, with the reading it belongs to.
 */
final readonly class PendingSegment
{
    public function __construct(public UnparsedSubstitutions $toParse, public WordSegment $segment) {}

    /**
     * @return list<self>
     */
    public static function allOf(UnparsedSubstitutions $toParse): array
    {
        return array_map(fn (WordSegment $segment): self => new self($toParse, $segment), $toParse->word->segments);
    }
}
