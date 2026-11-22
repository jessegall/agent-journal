<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;
use App\Contracts\Events\ListenerFailureLog;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Support\ActorIdentity;

/**
 * A message was answered; raised once that has committed.
 */
final readonly class MessageAnswered implements
    Event,
    ListenerFailureLog,
    UserInterfaceUpdater
{
    public function __construct(
        public string $messageId,
        public string $replyId,
        public ActorIdentity $answeredBy,
    ) {}
}
