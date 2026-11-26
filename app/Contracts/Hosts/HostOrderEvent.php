<?php

declare(strict_types=1);

namespace App\Contracts\Hosts;

use App\Contracts\Events\Event;

/**
 * A host answered an order, or refused it, or it expired unanswered.
 */
interface HostOrderEvent extends Event
{
    public string $orderId { get; }
}
