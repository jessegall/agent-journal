<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Chat\MessageBatchEvent;

/**
 * A message batch was granted the claims of its messages.
 */
final readonly class MessageBatchClaimsGranted extends MessageEvent implements MessageBatchEvent
{
    public function __construct(
        public string $batchId,
    ) {}
}
