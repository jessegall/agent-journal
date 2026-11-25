<?php

declare(strict_types=1);

namespace App\Commands\Inboxes\LeaveInbox;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Models\Inboxes\InboxMember;

/**
 * Detaches the actor from the inbox.
 */
final readonly class LeaveInboxHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    public function handle(LeaveInboxCommand $command): void
    {
        $member = InboxMember::findActive($command->inboxId, $command->actor);

        if ($member === null) {
            return;
        }

        $member->leave($this->clock->now());
    }
}
