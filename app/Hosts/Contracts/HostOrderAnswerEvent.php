<?php

declare(strict_types=1);

namespace App\Hosts\Contracts;

use App\Hosts\Enums\HostOrderType;

/**
 * A host answered an order, or refused it, or it expired unanswered: the order's worker reads the answer.
 */
interface HostOrderAnswerEvent extends HostOrderEvent
{
    public HostOrderType $type { get; }
}
