<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Notifications\NotificationReceiptEvent;

/**
 * A hidden notification was shown again.
 */
final readonly class NotificationReceiptRevealed extends MessageEvent implements NotificationReceiptEvent
{
    public function __construct(
        public string $receiptId,
    ) {}
}
