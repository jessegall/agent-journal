<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Hosts\HostProcessEvent;

/**
 * The process holds the order that opens it.
 */
final readonly class HostProcessOpenOrderHeld implements ConnectionEvent, HostProcessEvent
{
    public function __construct(public string $processId, public string $orderId) {}
}
