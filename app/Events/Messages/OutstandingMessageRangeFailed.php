<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Chat\OutstandingMessageEvent;

/**
 * An outstanding range of messages failed one more delivery.
 */
final readonly class OutstandingMessageRangeFailed extends MessageEvent implements OutstandingMessageEvent
{
    public function __construct(
        public string $rangeId,
    ) {}
}
