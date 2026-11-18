<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Actors\Support\ActorIdentity;
use App\Contracts\Event;
use App\Ui\Contracts\UpdatesUserInterface;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A message was sent from one actor to another; raised once the send has committed. It carries no text.
 */
final readonly class MessageSent implements Event, ShouldDispatchAfterCommit, UpdatesUserInterface
{
    public function __construct(
        public string $messageId,
        public ActorIdentity $sender,
        public ActorIdentity $recipient,
    ) {}
}
