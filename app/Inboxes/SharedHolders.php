<?php

declare(strict_types=1);

namespace App\Inboxes;

use App\Actors\Contracts\ActorTypes;
use App\Assignments\Contracts\SharedHolders as SharedHoldersContract;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorReference;
use App\Support\AssigneeIdentity;

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
                ->ofActor(ActorReference::fromStored($member->type, $member->id))
                ->inboxIds(),
        ];
    }
}
