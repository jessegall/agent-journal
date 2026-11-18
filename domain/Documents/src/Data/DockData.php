<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One session's dock: its newest active cards, whether more follow, and the cards hidden from it.
 */
#[TypeScript]
final class DockData extends Data
{
    /**
     * @param  list<DockCard>  $cards
     * @param  list<DockCard>  $hidden
     */
    public function __construct(
        public readonly string $sessionId,
        #[DataCollectionOf(DockCard::class)]
        public readonly array $cards,
        public readonly bool $hasMore,
        #[DataCollectionOf(DockCard::class)]
        public readonly array $hidden,
    ) {}
}
