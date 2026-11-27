<?php

declare(strict_types=1);

namespace App\Search\Stored;

use App\Search\SourceProgress;
use App\Values\SourcePosition;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * One source's progress as a search's stored state writes it: where it stopped and the hits it still holds.
 */
final class StoredSourceProgress extends Data
{
    /**
     * @param  array<string, mixed>|null  $position
     * @param  list<StoredSearchHit>  $buffer
     */
    public function __construct(
        public readonly string $source,
        public readonly array|null $position,
        public readonly bool $isExhausted,
        #[DataCollectionOf(StoredSearchHit::class)]
        public readonly array $buffer,
        public readonly int $stalls,
        public readonly bool $hasFailed,
    ) {}

    public static function fromSourceProgress(SourceProgress $progress): self
    {
        return self::from([
            'source' => $progress->sourceKey,
            'position' => $progress->position?->fields,
            'isExhausted' => $progress->isExhausted,
            'buffer' => $progress->buffer,
            'stalls' => $progress->stalls,
            'hasFailed' => $progress->hasFailed,
        ]);
    }

    public function toSourceProgress(): SourceProgress
    {
        return new SourceProgress(
            $this->source,
            $this->position === null ? null : SourcePosition::of($this->position),
            $this->isExhausted,
            array_map(fn (StoredSearchHit $hit) => $hit->toBufferedHit(), $this->buffer),
            $this->stalls,
            $this->hasFailed,
        );
    }
}
