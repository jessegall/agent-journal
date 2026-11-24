<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * A conversation's placements with only their safe facts, and whether more lie past them.
 */
final class DockListData extends Data
{
    /**
     * @param  list<DockedSourceData>  $placements
     */
    public function __construct(
        public readonly string $conversationId,
        #[DataCollectionOf(DockedSourceData::class)]
        public readonly array $placements,
        public readonly bool $hasMore,
    ) {}
}
