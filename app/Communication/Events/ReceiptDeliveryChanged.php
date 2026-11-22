<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Communication\Enums\ReceiptDeliveryState;
use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;

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
