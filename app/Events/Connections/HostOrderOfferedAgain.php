<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostOrderEvent;

/**
 * The order a host's earlier process claimed is offered to the host again, as the host started anew.
 */
final readonly class HostOrderOfferedAgain implements ConnectionEvent, HostOrderEvent
{
    public function __construct(public string $orderId, public string|null $processId) {}
}
