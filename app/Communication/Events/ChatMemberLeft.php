<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Actors\Support\ActorIdentity;
use App\Communication\Enums\LeaveReason;
use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;

/**
 * An actor's interval in a chat inbox ended, for the reason given.
 */
final readonly class ChatMemberLeft implements Event, UserInterfaceUpdater
{
    public function __construct(
        public string $intervalId,
        public string $inboxId,
        public ActorIdentity $member,
        public LeaveReason $reason,
    ) {}
}
