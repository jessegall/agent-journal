<?php

declare(strict_types=1);

namespace App\Commands\Inboxes\OpenInbox;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;

final readonly class OpenInboxHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    public function handle(OpenInboxCommand $command): string
    {
        $inbox = Inbox::query()
            ->withProviderKey($command->providerKey)
            ->ofProvider($command->providerId)
            ->lockForUpdate()
            ->first() ?? Inbox::create($command->providerKey, $command->providerId, $command->label);

        foreach ($command->members as $member) {
            if (! InboxMember::isAttached($inbox->id, $member)) {
                InboxMember::join($inbox->id, $member, $this->clock->now());
            }
        }

        return $inbox->id;
    }
}
