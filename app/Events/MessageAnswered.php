<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use App\Contracts\ListenerFailureLog;
use App\Contracts\UserInterfaceUpdater;
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
