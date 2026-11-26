<?php

declare(strict_types=1);

namespace App\Notifications\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One page of a scope's changes after a cursor, oldest first, up to the scan's pinned version: the next page's
 * cursor while the scan goes on, the cursor to resume from once it ended, and reset when the cursor is older than
 * what is kept, so the reader takes a fresh snapshot instead.
 */
#[TypeScript]
final class NotificationChangePage extends Data
{
    public const int SIZE = 20;

    /**
     * @param  list<NotificationChangeItem>  $changes
     */
    public function __construct(
        public readonly bool $isReset,
        public readonly string $version,
        public readonly int $unread,
        public readonly string|null $nextCursor,
        public readonly string $cursor,
        #[DataCollectionOf(NotificationChangeItem::class)]
        public readonly array $changes,
    ) {}
}
