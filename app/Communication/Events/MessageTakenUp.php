<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Actors\Support\ActorIdentity;
use App\Contracts\Event;
use App\Contracts\LogsListenerFailures;

/**
 * A waiting message was taken up by the actor that answers it.
 */
final readonly class MessageTakenUp implements Event, LogsListenerFailures
{
    public function __construct(
        public string $messageId,
        public ActorIdentity $claimant,
    ) {}
}
