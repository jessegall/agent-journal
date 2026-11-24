<?php

declare(strict_types=1);

namespace App\Commands\Inboxes\JoinInbox;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Models\Inboxes\InboxMember;

/**
 * Attaches the actor to the inbox.
 */
final readonly class JoinInboxHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    public function handle(JoinInboxCommand $command): void
    {
        InboxMember::join($command->inboxId, $command->actor, $this->clock->now());
    }
}
