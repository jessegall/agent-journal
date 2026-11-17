<?php

declare(strict_types=1);

namespace App\Domain\Plans\Support;

use App\Core\Assignments\Contracts\AssignableProvider;
use App\Core\Assignments\Exceptions\RecordUnavailable;
use App\Core\Assignments\Support\RecordIdentity;
use App\Core\Contracts\Assignable;
use App\Core\Contracts\CurrentActor;
use App\Domain\Plans\Models\Plan;
use Illuminate\Container\Attributes\Scoped;

/**
 * Plans as assignable records: every signed-in actor may see every plan, and a plan's work is over once it is done or
 * cancelled.
 */
#[Scoped]
final readonly class PlanAssignments implements AssignableProvider
{
    public function __construct(private CurrentActor $actors) {}

    public function requireAssignable(RecordIdentity $record): Assignable
    {
        $this->actors->actor();

        return Plan::query()->whereKey($record->id)->lock('for key share')->first() ?? throw RecordUnavailable::for($record);
    }

    /**
     * @param  list<RecordIdentity>  $records
     * @return list<RecordIdentity>
     */
    public function visibleRecords(array $records): array
    {
        $this->actors->actor();
        $found = Plan::query()->whereKey(array_map(fn (RecordIdentity $record) => $record->id, $records))->pluck('id')->all();

        return array_values(array_filter($records, fn (RecordIdentity $record) => in_array($record->id, $found, true)));
    }

    /**
     * @param  list<Assignable>  $records
     * @return list<RecordIdentity>
     */
    public function finishedRecords(array $records): array
    {
        return array_values(array_map(
            fn (Plan $plan) => $plan->assignmentIdentity(),
            array_filter($records, fn (Assignable $record) => $record instanceof Plan && $record->state->hasEnded()),
        ));
    }
}
