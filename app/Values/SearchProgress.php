<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\SearchWordsInvalid;

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
        ], JSON_THROW_ON_ERROR);
    }

    /**
     * @throws SearchWordsInvalid
     */
    public static function fromJson(string $json): self
    {
        $fields = json_decode($json, true, 16, JSON_THROW_ON_ERROR);
        $sources = [];

        foreach ($fields['sources'] as $source) {
            $progress = SourceProgress::fromArray($source);
            $sources[$progress->sourceKey] = $progress;
        }

        return new self(
            SearchWords::fromInput($fields['words']),
            $fields['within'],
            $fields['limit'],
            $sources,
            $fields['delivered'],
            $fields['frontier'] === null ? null : BufferedHit::fromArray($fields['frontier']),
            $fields['idle_calls'],
        );
    }
}
