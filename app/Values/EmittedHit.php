<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ScoreTier;
use App\Support\RecordIdentity;

/**
 * One hit as the search shows it: the source's key and label, the title and excerpt, the record, the tier and the
 * read that opens it, checked for this reader when it was emitted.
 */
final readonly class EmittedHit
{
    public function __construct(
        public string $sourceKey,
        public string $sourceLabel,
        public string $title,
        public string $snippet,
        public RecordIdentity $reference,
        public ScoreTier $score,
        public RecordLocation|null $location,
        public OpenAction $open,
    ) {}

    public static function of(DeclaredSearchable $source, SearchResult $result, OpenAction $open): self
    {
        return new self(
            $source->qualifiedKey,
            $source->label(),
            $result->title,
            $result->snippet,
            $result->reference,
            $result->score,
            $result->location,
            $open,
        );
    }

    /**
     * The same hit with its optional excerpt left out, for an answer whose bytes are nearly full.
     */
    public function withoutSnippet(): self
    {
        return clone ($this, ['snippet' => '']);
    }

    /**
     * The bytes the hit takes in an answer.
     */
    public function byteSize(): int
    {
        return strlen(json_encode($this->toArray(), JSON_THROW_ON_ERROR));
    }

    public function identity(): HitIdentity
    {
        return new HitIdentity($this->sourceKey, $this->reference->type, $this->reference->id, $this->location?->id);
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'searchable' => $this->sourceKey,
            'label' => $this->sourceLabel,
            'title' => $this->title,
            'snippet' => $this->snippet,
            'reference' => ['type' => $this->reference->type, 'id' => $this->reference->id],
            'location' => $this->location === null ? null : [
                'id' => $this->location->id,
                'label' => $this->location->label,
            ],
            'score' => $this->score->value,
            'open' => $this->open->toArray(),
        ];
    }
}
