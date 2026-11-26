<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Hosts\HostProcessEvent;

/**
 * The process took the number of its next order.
 */
final readonly class HostProcessOrderNumbered implements ConnectionEvent, HostProcessEvent
{
    public function __construct(public string $processId, public int $sequence) {}
}
