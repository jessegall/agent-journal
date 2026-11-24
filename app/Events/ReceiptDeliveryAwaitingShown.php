<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Chat\ChatDeliveryEvent;

/**
 * A receipt delivery waits until its message is shown, up to its lease.
 */
final readonly class ReceiptDeliveryAwaitingShown extends MessageEvent implements ChatDeliveryEvent
{
    public function __construct(public string $deliveryId, public string $receiptId) {}
}
