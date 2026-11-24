<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Sharing\SharedHolders;
use App\Enums\ActorType;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;

/**
 * An actor shares the work of every inbox it is attached to.
 */
final readonly class AttachedInboxes implements SharedHolders
{
    public function sharedWith(AssigneeIdentity $member): array
    {
        $type = ActorType::tryFrom($member->type);

        if ($type === null) {
            return [];
        }

        return [
            Inbox::ASSIGNEE_TYPE => InboxMember::query()
                ->active()
                ->ofActor(new ActorIdentity($type, $member->id))
                ->select('inbox_id'),
        ];
    }
}
