<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

use App\Processes\Values\WordSegment;

/**
 * One segment of a word still to search for substitutions, with the reading it belongs to.
 */
final readonly class PendingSegment
{
    public function __construct(public SubstitutionsReading $reading, public WordSegment $segment) {}

    /**
     * @return list<self>
     */
    public static function allOf(SubstitutionsReading $reading): array
    {
        return array_map(fn (WordSegment $segment): self => new self($reading, $segment), $reading->word->segments);
    }
}
