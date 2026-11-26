<?php

declare(strict_types=1);

namespace App\Inboxes\Commands\JoinInbox;

use App\Bus\Contracts\CommandHandler;
use App\Models\Inboxes\InboxMember;
use App\Time\Contracts\ServerClock;

/**
 * Attaches the actor to the inbox.
 */
final readonly class JoinInboxHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    public function handle(JoinInboxCommand $command): void
    {
        InboxMember::create($command->inboxId, $command->actor, $this->clock->now());
    }
}
