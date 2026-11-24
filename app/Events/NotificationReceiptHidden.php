<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Chat\NotificationReceiptEvent;

/**
 * A notification was hidden.
 */
final readonly class NotificationReceiptHidden extends MessageEvent implements NotificationReceiptEvent
{
    public function __construct(
        public string $receiptId,
    ) {}
}
