<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Chat\NotificationReceiptEvent;

/**
 * A notification was marked read.
 */
final readonly class NotificationReceiptRead extends MessageEvent implements NotificationReceiptEvent
{
    public function __construct(
        public string $receiptId,
    ) {}
}
