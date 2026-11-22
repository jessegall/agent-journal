<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\SearchBatchInvalid;

/**
 * A query that rereads hits the search already holds: the original words and at most 51 identities of this
 * source. The provider rereads them in bulk, checks live access and answers each that still matches; it never
 * moves its forward position.
 */
final readonly class RefreshCandidates
{
    /**
     * Who rereads the hits, the same reader as the original query's.
     */
    public SearchReader $reader;

    /**
     * @param  list<HitIdentity>  $candidates
     *
     * @throws SearchBatchInvalid
     */
    public function __construct(
        public SearchQuery $original,
        public array $candidates,
    ) {
        $this->reader = $original->reader;

        if (count($candidates) > SearchQuery::HIT_LIMIT) {
            throw SearchBatchInvalid::tooManyCandidates(SearchQuery::HIT_LIMIT);
        }
    }

    public function asks(HitIdentity $identity): bool
    {
        return array_any($this->candidates, fn (HitIdentity $candidate): bool => $candidate->equals($identity));
    }

    /**
     * The record ids asked about, once each, for the provider's bulk reread.
     *
     * @return list<string>
     */
    public function recordIds(): array
    {
        $ids = array_map(fn (HitIdentity $candidate) => $candidate->recordId, $this->candidates);

        return array_values(array_unique($ids));
    }
}
