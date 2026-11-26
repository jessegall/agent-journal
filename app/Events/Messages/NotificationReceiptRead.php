<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Notifications\Contracts\NotificationReceiptEvent;

/**
 * A notification was marked read.
 */
final readonly class NotificationReceiptRead implements MessageEvent, NotificationReceiptEvent
{
    public function __construct(
        public string $receiptId,
    ) {}
}
