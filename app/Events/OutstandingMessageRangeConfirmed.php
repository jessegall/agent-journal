<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Chat\OutstandingMessageEvent;

/**
 * An outstanding range of messages was confirmed.
 */
final readonly class OutstandingMessageRangeConfirmed extends MessageEvent implements OutstandingMessageEvent
{
    public function __construct(
        public string $rangeId,
    ) {}
}
