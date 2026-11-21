<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Actors\Support\ActorIdentity;
use App\Contracts\Event;
use App\Contracts\ListenerFailureLog;
use App\Ui\Contracts\UserInterfaceUpdater;

/**
 * A message was read for the first time.
 */
final readonly class MessageRead implements Event, ListenerFailureLog, UserInterfaceUpdater
{
    public function __construct(
        public string $messageId,
        public string $inboxId,
        public ActorIdentity $reader,
    ) {}
}
