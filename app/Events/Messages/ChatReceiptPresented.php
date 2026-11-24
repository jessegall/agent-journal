<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Chat\ChatDeliveryEvent;
use App\Contracts\Navigation\UserInterfaceUpdater;

/**
 * One member was shown one chat message for the first time.
 */
final readonly class ChatReceiptPresented extends MessageEvent implements ChatDeliveryEvent, UserInterfaceUpdater
{
    public function __construct(
        public string $receiptId,
        public string $messageId,
        public string $intervalId,
    ) {}
}
