<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use App\Contracts\ListenerFailureLog;
use App\Contracts\UserInterfaceUpdater;
use App\Support\ActorIdentity;

/**
 * A waiting message was taken up by the actor that answers it.
 */
final readonly class MessageTakenUp implements Event, ListenerFailureLog, UserInterfaceUpdater
{
    public function __construct(
        public string $messageId,
        public ActorIdentity $claimant,
    ) {}
}
