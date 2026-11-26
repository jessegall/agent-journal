<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Hosts\HostOrderEvent;

/**
 * The journal made an order for the host, which wakes the host's claim once it commits.
 */
final readonly class HostOrderMade implements ConnectionEvent, HostOrderEvent
{
    public function __construct(public string $orderId, public string|null $processId, public string $hostId) {}
}
