<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A page of a chat's entries older than the one asked from, oldest first, and whether older ones still exist.
 */
#[TypeScript]
final class ChatRowsPageData extends Data
{
    /**
     * @param  list<ChatEntryData>  $entries
     */
    public function __construct(
        #[DataCollectionOf(ChatEntryData::class)]
        public readonly array $entries,
        public readonly bool $hasOlder,
    ) {}
}
