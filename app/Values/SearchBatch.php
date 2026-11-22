<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Bus\BatchOutcome;
use App\Enums\FailureReason;
use App\Exceptions\SearchBatchInvalid;

/**
 * What one provider call answers: the read version it observed, its certified hits in order and exactly one
 * outcome. Exhausted and more carry hits, more at least one; scanning and failed carry none; a refreshed batch
 * answers only the candidates it was asked about. A failed batch observed no version.
 */
final readonly class SearchBatch
{
    /**
     * @param  list<SearchResult>  $hits
     *
     * @throws SearchBatchInvalid
     */
    private function __construct(
        public string|null $observedVersion,
        public array $hits,
        public BatchOutcome $outcome,
    ) {
        if (! $outcome->canCarryHits() && $hits !== []) {
            throw SearchBatchInvalid::hitsOnEmptyOutcome($outcome->name());
        }

        if (count($hits) > SearchQuery::HIT_LIMIT) {
            throw SearchBatchInvalid::tooManyHits(SearchQuery::HIT_LIMIT);
        }

        self::assertOrdered($hits);
    }

    /**
     * The answer of a source the reader may search nothing of: no hits and no work left.
     */
    public static function nothing(): self
    {
        return self::exhausted('', []);
    }

    /**
     * @param  list<SearchResult>  $hits
     */
    public static function exhausted(string $observedVersion, array $hits): self
    {
        return new self($observedVersion, $hits, new ExhaustedOutcome());
    }

    /**
     * @param  list<SearchResult>  $hits
     */
    public static function more(string $observedVersion, array $hits, SourcePosition $nextSeek): self
    {
        if ($hits === []) {
            throw SearchBatchInvalid::moreWithoutHits();
        }

        return new self($observedVersion, $hits, new MoreOutcome($nextSeek));
    }

    public static function scanning(string $observedVersion, SourcePosition $nextWork): self
    {
        return new self($observedVersion, [], new ScanningOutcome($nextWork));
    }

    public static function failed(FailureReason $reason): self
    {
        return new self(null, [], new FailedOutcome($reason));
    }

    /**
     * The current matches of the candidates a refresh asked about; a candidate with no match here is dropped.
     *
     * @param  list<SearchResult>  $matches
     */
    public static function refreshed(string $observedVersion, RefreshCandidates $query, array $matches): self
    {
        foreach ($matches as $match) {
            $identity = $match->identity($query->sourceKey());

            if (! $query->asks($identity)) {
                throw SearchBatchInvalid::notRequested($identity->key());
            }
        }

        return new self($observedVersion, $matches, new RefreshedOutcome());
    }

    /**
     * The current match of one refreshed candidate, or null when the source dropped it.
     */
    public function currentMatch(HitIdentity $identity): SearchResult|null
    {
        foreach ($this->hits as $hit) {
            if ($hit->identity($identity->sourceKey)->equals($identity)) {
                return $hit;
            }
        }

        return null;
    }

    /**
     * The bytes of this batch's hits as a search would carry them, to refuse a provider whose output is too large.
     */
    public function byteSize(): int
    {
        return array_sum(array_map(fn (SearchResult $hit): int => $hit->byteSize(), $this->hits));
    }

    public function hasFailed(): bool
    {
        return $this->outcome instanceof FailedOutcome;
    }

    public function isExhausted(): bool
    {
        return $this->outcome instanceof ExhaustedOutcome;
    }

    /**
     * @param  list<SearchResult>  $hits
     */
    private static function assertOrdered(array $hits): void
    {
        foreach (array_slice($hits, 1, null, true) as $index => $hit) {
            $order = $hits[$index - 1]->compare($hit);

            if ($order === 0) {
                throw SearchBatchInvalid::repeated($hit->identity('')->key());
            }

            if ($order > 0) {
                throw SearchBatchInvalid::outOfOrder();
            }
        }
    }
}
