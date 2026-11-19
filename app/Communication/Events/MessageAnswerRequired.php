<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Contracts\Event;
use App\Contracts\LogsListenerFailures;

/**
 * A message's author asked for an answer to it; it now waits at its destination inbox.
 */
final readonly class MessageAnswerRequired implements Event, LogsListenerFailures
{
    public function __construct(
        public string $messageId,
        public string $destinationInboxId,
    ) {}
}
