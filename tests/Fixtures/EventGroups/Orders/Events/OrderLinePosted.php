<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventGroups\Orders\Events;

/**
 * An order line event that shares its stem with another and no group, and carries the order id its group leaves out.
 */
final readonly class OrderLinePosted implements OrderEvent
{
    public function __construct(public string $orderId) {}
}
