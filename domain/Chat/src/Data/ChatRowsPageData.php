<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One page of a chat's rows by speaker and the plain lines among them, oldest first, and the cursor of the page before it, or null at the start.
 *
 * @method static static from(array<string, mixed> $page)
 */
#[TypeScript]
final class ChatRowsPageData extends Data
{
    /**
     * @param  list<ChatMessageData>  $messages
     * @param  list<ChatLineData>  $lines
     */
    public function __construct(
        #[DataCollectionOf(ChatMessageData::class)]
        public readonly array $messages,
        #[DataCollectionOf(ChatLineData::class)]
        public readonly array $lines,
        public readonly string|null $olderCursor,
    ) {}
}
