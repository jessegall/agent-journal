<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Actors\Support\ActorIdentity;
use App\Communication\Enums\DismissalType;
use App\Contracts\Event;
use App\Contracts\LogsListenerFailures;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A message was closed without an answer: by whom and in which way, never the reason's text.
 */
final readonly class MessageDismissed implements Event, LogsListenerFailures, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $messageId,
        public ActorIdentity $dismissedBy,
        public DismissalType $type,
    ) {}
}
