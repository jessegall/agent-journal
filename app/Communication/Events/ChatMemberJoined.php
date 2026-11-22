<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Actors\Support\ActorIdentity;
use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;

/**
 * An actor began an interval in a chat inbox and takes part in it from that timeline position.
 */
final readonly class ChatMemberJoined implements Event, UserInterfaceUpdater
{
    public function __construct(
        public string $intervalId,
        public string $inboxId,
        public ActorIdentity $member,
    ) {}
}
