<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Chat\OutstandingMessageEvent;

/**
 * An outstanding range of messages gave up for the reason given.
 */
final readonly class OutstandingMessageRangeExhausted extends MessageEvent implements OutstandingMessageEvent
{
    public function __construct(
        public string $rangeId,
        public string $reason,
    ) {}
}
