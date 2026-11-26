<?php

declare(strict_types=1);

namespace App\Contracts\Hosts;

use App\Contracts\Events\Event;

/**
 * Something happened to one order the journal made for a host: it was made, claimed, answered or refused.
 */
interface HostOrderEvent extends Event
{
    public string $orderId { get; }

    public string|null $processId { get; }
}
