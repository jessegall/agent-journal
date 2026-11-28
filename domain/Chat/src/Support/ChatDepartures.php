<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Inboxes\Contracts\InboxParticipationEnding;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorReference;
use App\Time\Contracts\ServerClock;

/**
 * An actor that may no longer take part in chats leaves every chat it is attached to.
 */
final readonly class ChatDepartures implements InboxParticipationEnding
{
    public function __construct(private ServerClock $clock) {}

    public function endInEnvironment(ActorReference $user, string|null $environmentId): void
    {
        $this->leaveAll($user);
    }

    public function endEverywhere(ActorReference $user): void
    {
        $this->leaveAll($user);
    }

    public function endForRetirement(ActorReference $agent): void
    {
        $this->leaveAll($agent);
    }

    private function leaveAll(ActorReference $actor): void
    {
        $chats = Inbox::query()
            ->withAnyProviderKey([ChatDirectory::PAIR_PROVIDER, ChatDirectory::GROUP_PROVIDER])
            ->attachedTo($actor)
            ->limit(InboxMember::ATTACHED_LIMIT)
            ->pluck('id');

        foreach ($chats as $inboxId) {
            $member = InboxMember::findActive((string) $inboxId, $actor);

            if ($member !== null) {
                $member->leave($this->clock->now());
            }
        }
    }
}
