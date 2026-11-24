<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Chat\MessageBatchEvent;

/**
 * A message batch's delivery made progress.
 */
final readonly class MessageBatchProgressed extends MessageEvent implements MessageBatchEvent
{
    public function __construct(
        public string $batchId,
    ) {}
}
