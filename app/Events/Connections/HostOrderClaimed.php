<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Hosts\HostOrderEvent;

/**
 * The host claimed the order to carry it out.
 */
final readonly class HostOrderClaimed implements ConnectionEvent, HostOrderEvent
{
    public function __construct(public string $orderId, public string|null $processId) {}
}
