<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Contracts\Chat\MessageOffered;
use App\Contracts\Events\ListenerFailureLog;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Support\ActorIdentity;

/**
 * A waiting message was claimed by the actor that answers it.
 */
final readonly class MessageClaimed extends MessageEvent implements
    ListenerFailureLog,
    MessageOffered,
    UserInterfaceUpdater
{
    public function __construct(
        public string $messageId,
        public string $inboxId,
        public ActorIdentity $claimant,
    ) {}

    public function answerer(): ActorIdentity
    {
        return $this->claimant;
    }
}
