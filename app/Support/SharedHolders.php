<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActorTypes;
use App\Contracts\Sharing\SharedHolders as SharedHoldersContract;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;

/**
 * An actor shares the work of every inbox it is attached to.
 */
final readonly class SharedHolders implements SharedHoldersContract
{
    public function __construct(private ActorTypes $actorTypes) {}

    public function sharedWith(AssigneeIdentity $member): array
    {
        if (! in_array($member->type, $this->actorTypes->types(), true)) {
            return [];
        }

        return [
            Inbox::ASSIGNEE_TYPE => InboxMember::query()
                ->active()
                ->ofActor(ActorIdentity::fromStored($member->type, $member->id))
                ->inboxIds(),
        ];
    }
}
