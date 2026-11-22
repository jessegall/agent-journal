<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;

/**
 * Chat receipts of agent members were given deliveries in the transaction that accepted their message; once it
 * commits, their recipients are woken.
 */
final readonly class ReceiptDeliveriesScheduled implements Event
{
    /**
     * @param  list<string>  $deliveryIds
     */
    public function __construct(public array $deliveryIds) {}
}
