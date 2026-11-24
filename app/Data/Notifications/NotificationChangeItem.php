<?php

declare(strict_types=1);

namespace App\Data\Notifications;

use App\Enums\NotificationMutationType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One change as the reader may see it now: its version and receipt key, what happened, and the receipt's current
 * item while the reader may still see it; a removal, or a receipt now out of sight, carries the key alone.
 */
#[TypeScript]
final class NotificationChangeItem extends Data
{
    public function __construct(
        public readonly string $version,
        public readonly NotificationMutationType $type,
        public readonly string $receiptId,
        public readonly NotificationItem|Optional $item,
    ) {}
}
