<?php

declare(strict_types=1);

namespace Tests\Fixtures\EventGroups\Orders\Events;

/**
 * The second order line event without a shared group.
 */
final readonly class OrderLineRemoved implements OrderEvent
{
    public function __construct(public string $orderId) {}
}
