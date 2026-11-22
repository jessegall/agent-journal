<?php

declare(strict_types=1);

namespace App\Values;

/**
 * A result together with the source that returned it: its qualified key and label, as the search shows them.
 */
final readonly class SourceHit
{
    public function __construct(
        public string $sourceKey,
        public string $sourceLabel,
        public SearchResult $result,
    ) {}

    public function identity(): HitIdentity
    {
        return $this->result->identity($this->sourceKey);
    }

    /**
     * Below zero when this hit comes first in the one global order: score descending, then the identity ascending.
     */
    public function compare(self $other): int
    {
        return $this->result->score->compare($other->result->score) ?: $this->identity()->compare($other->identity());
    }

    /**
     * @param  list<self>  $hits
     * @return list<self>
     */
    public static function ordered(array $hits): array
    {
        usort($hits, fn (self $first, self $second): int => $first->compare($second));

        return $hits;
    }
}
