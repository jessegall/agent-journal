<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use App\Contracts\UserInterfaceUpdater;

/**
 * One member was shown one chat message for the first time.
 */
final readonly class ChatReceiptPresented implements Event, UserInterfaceUpdater
{
    public function __construct(
        public string $receiptId,
        public string $messageId,
        public string $intervalId,
    ) {}
}
