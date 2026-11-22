<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Support\SourceProgress;
use App\Values\BufferedHit;
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
        public readonly bool $exhausted,
        #[DataCollectionOf(StoredSearchHit::class)]
        public readonly array $buffer,
        public readonly int $stalls,
        public readonly bool $failed,
    ) {}

    public static function fromSourceProgress(SourceProgress $progress): self
    {
        return self::from([
            'source' => $progress->sourceKey,
            'position' => $progress->position?->fields,
            'exhausted' => $progress->exhausted,
            'buffer' => $progress->buffer,
            'stalls' => $progress->stalls,
            'failed' => $progress->failed,
        ]);
    }

    public function toSourceProgress(): SourceProgress
    {
        return new SourceProgress(
            $this->source,
            $this->position === null ? null : SourcePosition::of($this->position),
            $this->exhausted,
            array_map(fn (StoredSearchHit $hit): BufferedHit => $hit->toBufferedHit(), $this->buffer),
            $this->stalls,
            $this->failed,
        );
    }
}
