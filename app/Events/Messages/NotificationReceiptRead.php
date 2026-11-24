<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Notifications\NotificationReceiptEvent;

/**
 * A notification was marked read.
 */
final readonly class NotificationReceiptRead extends MessageEvent implements NotificationReceiptEvent
{
    public function __construct(
        public string $receiptId,
    ) {}
}
