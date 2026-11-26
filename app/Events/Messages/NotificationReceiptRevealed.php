<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Notifications\Contracts\NotificationReceiptEvent;

/**
 * A hidden notification was shown again.
 */
final readonly class NotificationReceiptRevealed implements MessageEvent, NotificationReceiptEvent
{
    public function __construct(
        public string $receiptId,
    ) {}
}
