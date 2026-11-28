<?php

declare(strict_types=1);

namespace App\Inboxes;

use App\Actors\Contracts\CurrentActor;
use App\Assignments\Contracts\Assignee;
use App\Assignments\Contracts\AssigneeProvider;
use App\Exceptions\AssigneeUnavailable;
use App\Models\Inboxes\Inbox;
use App\Support\AssigneeIdentity;
use App\Support\AssigneeList;
use App\Support\AssigneeName;
use App\Support\IdListPage;

/**
 * Core's inboxes as holders of work: any of them may receive work, and every signed-in actor sees them by their label.
 */
final readonly class InboxAssignees implements AssigneeProvider
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @throws AssigneeUnavailable
     */
    public function requireEligible(AssigneeIdentity $recipient): Assignee
    {
        $this->actors->actor();

        return Inbox::query()->ownedByCore()->whereKey($recipient->id)->sharedLock()->firstOr(
            AssigneeUnavailable::throwing()->forActor($recipient),
        );
    }

    /**
     * @throws AssigneeUnavailable
     */
    public function requireExclusive(AssigneeIdentity $recipient): Assignee
    {
        $this->actors->actor();

        return Inbox::query()->ownedByCore()->whereKey($recipient->id)->lockForUpdate()->firstOr(
            AssigneeUnavailable::throwing()->forActor($recipient),
        );
    }

    /**
     * @param  list<AssigneeIdentity>  $assignees
     * @return list<AssigneeName>
     */
    public function names(array $assignees): array
    {
        $this->actors->actor();
        $ids = array_values(array_unique(array_map(fn (AssigneeIdentity $assignee) => $assignee->id, $assignees)));

        return array_values(Inbox::query()->ownedByCore()->whereKey($ids)->oldestFirst()->get()
            ->map(fn (Inbox $inbox) => self::nameOf($inbox))
            ->all());
    }

    public function eligible(IdListPage $page): AssigneeList
    {
        $this->actors->actor();

        $inboxes = Inbox::query()->ownedByCore()
            ->when($page->afterId !== null, fn ($query) => $query->where('id', '>', $page->afterId))
            ->oldestFirst()
            ->limit($page->limit + 1)
            ->get();

        $shown = $inboxes->take($page->limit);

        return new AssigneeList(
            array_values($shown->map(fn (Inbox $inbox) => self::nameOf($inbox))->all()),
            $inboxes->count() > $page->limit ? $shown->last()?->id : null,
        );
    }

    private static function nameOf(Inbox $inbox): AssigneeName
    {
        return new AssigneeName($inbox->assigneeIdentity(), $inbox->label);
    }
}
