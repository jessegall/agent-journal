<?php

declare(strict_types=1);

namespace App\Support\Stored;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A search's progress as its stored state writes it: the words, scope and limit, each source's progress, what was
 * shown, the frontier hit and the call counts.
 */
#[MapName(SnakeCaseMapper::class)]
final class StoredSearchProgress extends Data
{
    /**
     * @param  list<StoredSourceProgress>  $sources
     * @param  list<string>  $delivered
     */
    public function __construct(
        public readonly string $words,
        public readonly string|null $within,
        public readonly int $limit,
        #[DataCollectionOf(StoredSourceProgress::class)]
        public readonly array $sources,
        public readonly array $delivered,
        public readonly StoredSearchHit|null $frontier,
        public readonly int $idleCalls,
        public readonly int $calls,
    ) {}
}
