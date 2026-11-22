<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;
use App\Contracts\Events\ListenerFailureLog;
use App\Contracts\Navigation\UserInterfaceUpdater;
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
