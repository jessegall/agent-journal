<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Enums\ScoreTier;
use App\Values\BufferedHit;
use App\Values\HitIdentity;
use Spatie\LaravelData\Data;

/**
 * One held search hit as a search's stored state writes it: its source, record, location and score.
 */
final class StoredSearchHit extends Data
{
    public function __construct(
        public readonly string $source,
        public readonly string $type,
        public readonly string $id,
        public readonly string|null $location,
        public readonly int $score,
    ) {}

    public function toBufferedHit(): BufferedHit
    {
        return new BufferedHit(
            new HitIdentity($this->source, $this->type, $this->id, $this->location),
            ScoreTier::from($this->score),
        );
    }
}
