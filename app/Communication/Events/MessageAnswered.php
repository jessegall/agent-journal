<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Actors\Support\ActorIdentity;
use App\Contracts\Event;
use App\Contracts\LogsListenerFailures;
use App\Ui\Contracts\UpdatesUserInterface;

/**
 * A message was answered; raised once that has committed.
 */
final readonly class MessageAnswered implements Event, LogsListenerFailures, UpdatesUserInterface
{
    public function __construct(
        public string $messageId,
        public string $replyId,
        public ActorIdentity $answeredBy,
    ) {}
}
