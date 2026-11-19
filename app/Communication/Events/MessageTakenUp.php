<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Actors\Support\ActorIdentity;
use App\Contracts\Event;
use App\Contracts\LogsListenerFailures;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A waiting message was taken up by the actor that answers it.
 */
final readonly class MessageTakenUp implements Event, LogsListenerFailures, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $messageId,
        public ActorIdentity $claimant,
    ) {}
}
