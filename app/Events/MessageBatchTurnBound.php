<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Chat\MessageBatchEvent;

/**
 * A message batch was bound to the driver turn that delivers it.
 */
final readonly class MessageBatchTurnBound extends MessageEvent implements MessageBatchEvent
{
    public function __construct(
        public string $batchId,
        public string $driverTurnId,
    ) {}
}
