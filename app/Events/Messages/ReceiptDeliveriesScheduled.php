<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Chat\ChatDeliveryEvent;

/**
 * Chat receipts of agent members were given deliveries in the transaction that accepted their message; once it
 * commits, their recipients are woken.
 */
final readonly class ReceiptDeliveriesScheduled extends MessageEvent implements ChatDeliveryEvent
{
    /**
     * @param  list<string>  $deliveryIds
     */
    public function __construct(public array $deliveryIds) {}
}
