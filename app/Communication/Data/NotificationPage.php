<?php

declare(strict_types=1);

namespace App\Communication\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One page of the signed-in actor's notifications, newest first: the highest sequence in it, the scope's version and
 * exact unread count, and the cursor of the next older page when there is one.
 */
#[TypeScript]
final class NotificationPage extends Data
{
    public const int SIZE = 20;

    /**
     * @param  list<NotificationItem>  $items
     */
    public function __construct(
        public readonly string|null $through,
        public readonly string $version,
        public readonly int $unread,
        public readonly string|null $nextCursor,
        #[DataCollectionOf(NotificationItem::class)]
        public readonly array $items,
    ) {}
}
