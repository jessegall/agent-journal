<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Hosts\Contracts\HostOrderAnswerEvent;
use App\Hosts\Enums\HostOrderType;
use App\Hosts\Enums\HostRefusal;

/**
 * The host refused the order, or it expired before a host answered it.
 */
final readonly class HostOrderRefused implements ConnectionEvent, HostOrderAnswerEvent
{
    public function __construct(
        public string $orderId,
        public string|null $processId,
        public HostOrderType $type,
        public HostRefusal $refusal,
    ) {}
}
