<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Chat\MessageBatchEvent;
use App\Enums\MessageBatchState;

/**
 * A message batch was settled with the outcome given.
 */
final readonly class MessageBatchSettled extends MessageEvent implements MessageBatchEvent
{
    public function __construct(
        public string $batchId,
        public MessageBatchState $outcome,
    ) {}
}
