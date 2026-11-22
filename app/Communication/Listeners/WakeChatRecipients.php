<?php

declare(strict_types=1);

namespace App\Communication\Listeners;

use App\Communication\Events\ReceiptDeliveriesScheduled;
use App\Communication\Support\ReceiptDeliveries;
use App\Contracts\Listener;
use Carbon\CarbonImmutable;

/**
 * Tries the deliveries a chat message scheduled as soon as the message is committed, rather than at the next pass.
 */
final readonly class WakeChatRecipients implements Listener
{
    public function __construct(private ReceiptDeliveries $deliveries) {}

    public function handle(ReceiptDeliveriesScheduled $event): void
    {
        $this->deliveries->deliver($event->deliveryIds, CarbonImmutable::now());
    }
}
