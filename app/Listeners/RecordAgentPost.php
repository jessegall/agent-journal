<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Agents\Activity\Contracts\ActivityLog;
use App\Agents\Enums\ActivityType;
use App\Contracts\Events\Listener;
use App\Events\Messages\MessageSent;
use App\Models\Access\User;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;

/**
 * Records an agent's message into an inbox a user is attached to as a post in the agent's activity, under the
 * inbox's label.
 */
final readonly class RecordAgentPost implements Listener
{
    public function __construct(private ActivityLog $activity) {}

    public function handle(MessageSent $fact): void
    {
        if (! $fact->sender->isAgent()) {
            return;
        }

        $hasUser = InboxMember::query()
            ->ofInbox($fact->inboxId)
            ->active()
            ->ofActorType(User::storedType())
            ->exists();

        if (! $hasUser) {
            return;
        }

        $inbox = Inbox::query()->findOrFail($fact->inboxId);
        $this->activity->record($fact->sender, ActivityType::Posted, $inbox->label);
    }
}
