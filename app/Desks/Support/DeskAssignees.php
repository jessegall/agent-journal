<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Actors\Contracts\CurrentActor;
use App\Assignments\Contracts\Assignee;
use App\Assignments\Contracts\AssigneeProvider;
use App\Assignments\Exceptions\AssigneeUnavailable;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssigneeList;
use App\Assignments\Support\AssigneeName;
use App\Assignments\Support\Page;
use App\Desks\Models\DeskRecord;

/**
 * Desks as holders of work: any desk may receive work, and every signed-in actor sees desks by their label.
 */
final readonly class DeskAssignees implements AssigneeProvider
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @throws AssigneeUnavailable
     */
    public function requireEligible(AssigneeIdentity $recipient): Assignee
    {
        $this->actors->actor();

        return DeskRecord::query()->whereKey($recipient->id)->sharedLock()->firstOr(
            fn () => throw AssigneeUnavailable::forActor($recipient),
        );
    }

    /**
     * @throws AssigneeUnavailable
     */
    public function requireExclusive(AssigneeIdentity $recipient): Assignee
    {
        $this->actors->actor();

        return DeskRecord::query()->whereKey($recipient->id)->lockForUpdate()->firstOr(
            fn () => throw AssigneeUnavailable::forActor($recipient),
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

        return array_values(DeskRecord::query()->whereKey($ids)->readLimit(count($ids))->orderBy('id')->get()
            ->map(fn (DeskRecord $desk) => self::nameOf($desk))
            ->all());
    }

    public function eligible(Page $page): AssigneeList
    {
        $this->actors->actor();
        $desks = DeskRecord::query()
            ->when($page->afterId !== null, fn ($query) => $query->where('id', '>', $page->afterId))
            ->orderBy('id')
            ->limit($page->limit + 1)
            ->get();
        $shown = $desks->take($page->limit);

        return new AssigneeList(
            array_values($shown->map(fn (DeskRecord $desk) => self::nameOf($desk))->all()),
            $desks->count() > $page->limit ? $shown->last()?->id : null,
        );
    }

    private static function nameOf(DeskRecord $desk): AssigneeName
    {
        return new AssigneeName($desk->assigneeIdentity(), $desk->label);
    }
}
