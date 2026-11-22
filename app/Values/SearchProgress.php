<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\SearchWordsInvalid;
use App\Support\Stored\StoredSearchProgress;

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
        public BufferedHit|null $frontier = null,
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
    public function isPastFrontier(BufferedHit $hit): bool
    {
        return $this->frontier === null || $this->frontier->compare($hit) < 0;
    }

    public function deliver(BufferedHit $hit): void
    {
        $this->delivered[] = $hit->identity->key();
        $this->frontier = $hit;
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
        return array_any($this->sources, fn (SourceProgress $source): bool => $source->needsRefill());
    }

    public function toJson(): string
    {
        return json_encode([
            'words' => $this->words->text,
            'within' => $this->within,
            'limit' => $this->limit,
            'sources' => array_values(array_map(fn (SourceProgress $source) => $source->toArray(), $this->sources)),
            'delivered' => $this->delivered,
            'frontier' => $this->frontier?->toArray(),
            'idle_calls' => $this->idleCalls,
            'calls' => $this->calls,
        ], JSON_THROW_ON_ERROR);
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
            $stored->frontier?->toBufferedHit(),
            $stored->idleCalls,
            $stored->calls,
        );
    }
}
