<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Actors\Contracts\CurrentActor;
use App\Assignments\Contracts\Assignable;
use App\Assignments\Contracts\AssignableProvider;
use App\Desks\Models\DeskSeat;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;

/**
 * Desk seats as assignable records: every signed-in actor may see every seat, and a seat's work never finishes.
 */
final readonly class DeskSeatProvider implements AssignableProvider
{
    public function __construct(private CurrentActor $actors) {}

    public function requireAssignable(RecordIdentity $record): Assignable
    {
        $this->actors->actor();

        return DeskSeat::query()->whereKey($record->id)->lock('for key share')->firstOr(
            fn () => throw RecordUnavailable::for($record),
        );
    }

    /**
     * @param  list<RecordIdentity>  $records
     * @return list<RecordIdentity>
     */
    public function visibleRecords(array $records): array
    {
        $this->actors->actor();
        $found = DeskSeat::query()
            ->whereKey(array_map(fn (RecordIdentity $record) => $record->id, $records))
            ->readLimit(count($records))
            ->pluck('id')
            ->all();

        return array_values(array_filter($records, fn (RecordIdentity $record) => in_array($record->id, $found, true)));
    }

    /**
     * @param  list<Assignable>  $records
     * @return list<RecordIdentity>
     */
    public function finishedRecords(array $records): array
    {
        return [];
    }
}
