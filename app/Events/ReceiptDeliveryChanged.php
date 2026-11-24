<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Chat\ChatDeliveryEvent;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Enums\WakeState;

/**
 * Waking one recipient about one chat receipt moved on: accepted, retried, waiting, given up or cancelled.
 */
final readonly class ReceiptDeliveryChanged extends MessageEvent implements ChatDeliveryEvent, UserInterfaceUpdater
{
    public function __construct(
        public string $deliveryId,
        public string $receiptId,
        public WakeState $state,
    ) {}
}
