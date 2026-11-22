<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignable;
use App\Contracts\AssignableProvider;
use App\Contracts\CurrentActor;
use App\Exceptions\RecordUnavailable;
use App\Models\DeskSeat;

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
            ->readExactly(count($records))
            ->pluck('id')
            ->all();

        return RecordIdentity::among($records, $found);
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
