<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\ListenerFailureLog;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Support\ActorIdentity;

/**
 * A message was read for the first time.
 */
final readonly class MessageRead extends MessageEvent implements ListenerFailureLog, UserInterfaceUpdater
{
    public function __construct(
        public string $messageId,
        public string $inboxId,
        public ActorIdentity $reader,
    ) {}
}
