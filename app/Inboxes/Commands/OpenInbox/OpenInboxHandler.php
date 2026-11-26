<?php

declare(strict_types=1);

namespace App\Inboxes\Commands\OpenInbox;

use App\Bus\Contracts\CommandHandler;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Time\Contracts\ServerClock;

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
                InboxMember::create($inbox->id, $member, $this->clock->now());
            }
        }

        return $inbox->getKey();
    }
}
