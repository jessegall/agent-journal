<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Enums\ReceiptDeliveryState;

/**
 * Waking one recipient about one chat receipt moved on: accepted, retried, waiting, given up or cancelled.
 */
final readonly class ReceiptDeliveryChanged implements Event, UserInterfaceUpdater
{
    public function __construct(
        public string $deliveryId,
        public string $receiptId,
        public ReceiptDeliveryState $state,
    ) {}
}
