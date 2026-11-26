<?php

declare(strict_types=1);

namespace App\Notifications\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to a notification receipt: every event of it implements this, so a listener typed on it receives them all.
 */
interface NotificationReceiptEvent extends Event
{
    public string $receiptId { get; }
}
