<?php

declare(strict_types=1);

namespace App\Inboxes\Commands\LeaveInbox;

use App\Bus\Contracts\CommandHandler;
use App\Models\Inboxes\InboxMember;
use App\Time\Contracts\ServerClock;

/**
 * Detaches each of the actors from the inbox; an actor that is no member is passed over.
 */
final readonly class LeaveInboxHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    public function handle(LeaveInboxCommand $command): void
    {
        foreach ($command->actors as $actor) {
            $member = InboxMember::findActive($command->inboxId, $actor);

            if ($member === null) {
                continue;
            }

            $member->leave($this->clock->now());
        }
    }
}
