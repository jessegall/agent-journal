<?php

declare(strict_types=1);

namespace App\Commands\Inboxes\LeaveInbox;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Models\Inboxes\InboxMember;

/**
 * Detaches each of the actors from the inbox; an actor that is no member is passed over.
 */
final readonly class LeaveInboxHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    public function handle(LeaveInboxCommand $command): void
    {
        foreach ($command->actors as $actor) {
            InboxMember::findActive($command->inboxId, $actor)?->leave($this->clock->now());
        }
    }
}
