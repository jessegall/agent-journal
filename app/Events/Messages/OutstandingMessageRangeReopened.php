<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Chat\OutstandingMessageEvent;

/**
 * An outstanding range of messages was opened again for delivery.
 */
final readonly class OutstandingMessageRangeReopened extends MessageEvent implements OutstandingMessageEvent
{
    public function __construct(
        public string $rangeId,
    ) {}
}
