<?php

declare(strict_types=1);

namespace App\Search;

use App\Search\Exceptions\SearchWordsInvalid;
use App\Search\Stored\StoredSearchProgress;
use App\Search\Values\BufferedHit;
use App\Search\Values\HitIdentity;
use App\Search\Values\SearchWords;

/**
 * The private state of one search between calls: its words and scope, the sources fixed at its start with their
 * progress, the identities already shown, the last one shown, and how many calls in a row published nothing.
 * It holds descriptors only, never a title or excerpt.
 */
final class SearchProgress
{
    /**
     * @param  array<string, SourceProgress>  $sources
     * @param  list<string>  $delivered  the keys of every identity shown
     */
    public function __construct(
        public readonly SearchWords $words,
        public readonly string|null $within,
        public readonly int $limit,
        public array $sources,
        public array $delivered = [],
        public BufferedHit|null $lastShown = null,
        public int $idleCalls = 0,
        public int $calls = 0,
    ) {}

    /**
     * @param  list<string>  $sourceKeys
     */
    public static function starting(SearchWords $words, string|null $within, int $limit, array $sourceKeys): self
    {
        $sources = [];

        foreach ($sourceKeys as $key) {
            $sources[$key] = new SourceProgress($key);
        }

        return new self($words, $within, $limit, $sources);
    }

    public function wasDelivered(HitIdentity $identity): bool
    {
        return in_array($identity->key(), $this->delivered, true);
    }

    /**
     * Whether the hit sorts after the last one shown, so showing it keeps the one global order.
     */
    public function isAfterLastShown(BufferedHit $hit): bool
    {
        return $this->lastShown === null || $this->lastShown->compare($hit) < 0;
    }

    public function deliver(BufferedHit $hit): void
    {
        $this->delivered[] = $hit->identity->key();
        $this->lastShown = $hit;
    }

    /**
     * Whether every source's range is exhausted and nothing is left to show.
     */
    public function isFinished(): bool
    {
        return array_all($this->sources, fn (SourceProgress $source): bool => $source->isDone());
    }

    /**
     * Whether some source has shown every hit it held and has more to give, so asking it again can fill the page.
     */
    public function hasSourceToRefill(): bool
    {
        return array_any($this->sources, fn (SourceProgress $source): bool => $source->awaitsRefill());
    }

    /**
     * The keys of the sources that failed during the search, so its answer says what it does not cover.
     *
     * @return list<string>
     */
    public function failedSourceKeys(): array
    {
        return array_keys(array_filter($this->sources, fn (SourceProgress $source): bool => $source->hasFailed));
    }

    /**
     * The source whose head leads the one global order, among the sources with a head.
     */
    public function leadingSource(): SourceProgress|null
    {
        $leadingSource = null;

        foreach ($this->sources as $source) {
            if ($source->head() === null) {
                continue;
            }

            if ($leadingSource === null || $source->leads($leadingSource)) {
                $leadingSource = $source;
            }
        }

        return $leadingSource;
    }

    public function toJson(): string
    {
        return StoredSearchProgress::fromSearchProgress($this)->toJson();
    }

    /**
     * The progress a search's stored state holds.
     *
     * @throws SearchWordsInvalid
     */
    public static function fromStored(StoredSearchProgress $stored): self
    {
        $sources = [];

        foreach ($stored->sources as $source) {
            $progress = $source->toSourceProgress();
            $sources[$progress->sourceKey] = $progress;
        }

        return new self(
            SearchWords::fromInput($stored->words),
            $stored->within,
            $stored->limit,
            $sources,
            $stored->delivered,
            $stored->lastShown?->toBufferedHit(),
            $stored->idleCalls,
            $stored->calls,
        );
    }
}
