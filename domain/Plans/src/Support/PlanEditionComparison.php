<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use Domain\Plans\Api\PlanEditionChanges;
use Domain\Plans\Models\PlanReviewEdition;
use Domain\Plans\Models\PlanReviewMember;

/**
 * Compares two editions of a plan's review in one bounded read of each: added, removed and changed members by task,
 * and the plan's own text; a comparison of larger editions says it covered only their first members.
 */
final readonly class PlanEditionComparison
{
    public const int MOST_MEMBERS = 1000;

    public function between(PlanReviewEdition $older, PlanReviewEdition $newer): PlanEditionChanges
    {
        $before = PlanReviewMember::firstOf($older->id, self::MOST_MEMBERS + 1)->keyBy('task_id');
        $after = PlanReviewMember::firstOf($newer->id, self::MOST_MEMBERS + 1)->keyBy('task_id');

        return new PlanEditionChanges(
            array_values($after->diffKeys($before)->map(fn (PlanReviewMember $member) => $member->task_number)->all()),
            array_values($before->diffKeys($after)->map(fn (PlanReviewMember $member) => $member->task_number)->all()),
            array_values($after->intersectByKeys($before)->filter(
                fn (PlanReviewMember $member) => $member->title !== $before[$member->task_id]->title
                    || $member->brief !== $before[$member->task_id]->brief,
            )->map(fn (PlanReviewMember $member) => $member->task_number)->all()),
            $older->title !== $newer->title || $older->brief !== $newer->brief || $older->type !== $newer->type,
            $before->count() <= self::MOST_MEMBERS && $after->count() <= self::MOST_MEMBERS,
        );
    }
}
