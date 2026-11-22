<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;
use App\Contracts\Events\ListenerFailureLog;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Enums\DismissalType;
use App\Support\ActorIdentity;

/**
 * A message was closed without an answer: by whom and in which way, never the reason's text.
 */
final readonly class MessageDismissed implements Event, ListenerFailureLog, UserInterfaceUpdater
{
    public function __construct(
        public string $messageId,
        public ActorIdentity $dismissedBy,
        public DismissalType $type,
    ) {}
}
