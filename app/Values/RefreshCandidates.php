<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\SearchBatchInvalid;

/**
 * A query that rereads hits the search already holds: the original words and at most 51 identities of this
 * source. The provider rereads them in bulk, checks live access and answers each that still matches; it never
 * moves its forward position.
 */
final readonly class RefreshCandidates extends SearchQuery
{
    /**
     * @param  list<HitIdentity>  $candidates
     *
     * @throws SearchBatchInvalid
     */
    public function __construct(
        SearchQuery $original,
        public array $candidates,
    ) {
        if (count($candidates) > self::HIT_LIMIT) {
            throw SearchBatchInvalid::tooManyCandidates(self::HIT_LIMIT);
        }

        parent::__construct(
            $original->reader,
            $original->words,
            $original->scope,
            $original->sourceKey,
            max(1, count($candidates)),
            $original->budget,
        );
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
