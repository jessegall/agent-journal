<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostOrderAnswerEvent;
use App\Hosts\Protocol\HostOrderType;

/**
 * The host carried out the order.
 */
final readonly class HostOrderAnswered implements ConnectionEvent, HostOrderAnswerEvent
{
    public function __construct(public string $orderId, public string|null $processId, public HostOrderType $type) {}
}
