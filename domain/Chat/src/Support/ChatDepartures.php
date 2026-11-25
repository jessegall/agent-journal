<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Contracts\Inboxes\InboxParticipationEnding;
use App\Contracts\Time\ServerClock;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;

/**
 * An actor that may no longer take part in chats leaves every chat it is attached to.
 */
final readonly class ChatDepartures implements InboxParticipationEnding
{
    public function __construct(private ServerClock $clock) {}

    public function endInEnvironment(ActorIdentity $user, string|null $environmentId): void
    {
        $this->leaveAll($user);
    }

    public function endEverywhere(ActorIdentity $user): void
    {
        $this->leaveAll($user);
    }

    public function endForRetirement(ActorIdentity $agent): void
    {
        $this->leaveAll($agent);
    }

    private function leaveAll(ActorIdentity $actor): void
    {
        $chats = Inbox::query()
            ->whereIn('provider_key', [
                ChatInboxes::PAIR_PROVIDER,
                ChatInboxes::GROUP_PROVIDER,
            ])
            ->attachedTo($actor)
            ->limit(InboxMember::ATTACHED_LIMIT)
            ->pluck('id');

        foreach ($chats as $inboxId) {
            InboxMember::leave((string) $inboxId, $actor, $this->clock->now());
        }
    }
}
