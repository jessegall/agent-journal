<?php

declare(strict_types=1);

namespace Domain\Plans\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Assignments\Assignable;
use App\Contracts\Assignments\AssignableProvider;
use App\Exceptions\RecordUnavailable;
use App\Support\RecordIdentity;
use Domain\Plans\Models\Plan;
use Illuminate\Container\Attributes\Scoped;

/**
 * Plans as assignable records: every signed-in actor may see every plan, and a plan's work is over once it is done or
 * cancelled.
 */
#[Scoped]
final readonly class PlanAssignmentProvider implements AssignableProvider
{
    public function __construct(private CurrentActor $actors) {}

    public function requireAssignable(RecordIdentity $record): Assignable
    {
        $this->actors->actor();

        return Plan::query()->whereKey(
            $record->id,
        )->lock('for key share')->firstOr(RecordUnavailable::throwing()->for($record));
    }

    /**
     * @param  list<RecordIdentity>  $records
     * @return list<RecordIdentity>
     */
    public function visibleRecords(array $records): array
    {
        $this->actors->actor();

        $visiblePlanIds = Plan::query()->whereKey(
            array_map(fn (RecordIdentity $record) => $record->id, $records),
        )->readExactly(count($records))->pluck('id')->all();

        return array_values(array_filter(
            $records,
            fn (RecordIdentity $record) => in_array($record->id, $visiblePlanIds, true),
        ));
    }

    /**
     * @param  list<Assignable>  $records
     * @return list<RecordIdentity>
     */
    public function finishedRecords(array $records): array
    {
        return array_values(array_map(
            fn (Plan $plan) => $plan->assignmentIdentity(),
            array_filter($records, fn (Assignable $record) => $record instanceof Plan && $record->status->hasEnded()),
        ));
    }
}
