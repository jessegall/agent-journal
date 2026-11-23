<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\Assignable;
use App\Contracts\Assignments\AssignableProvider;
use App\Exceptions\RecordUnavailable;
use App\Models\Drivers\NavigationRequest;

/**
 * Navigation requests as assignable records: the journal gives each to the desk that answers it, and a request's work
 * is finished once it left its open states.
 */
final readonly class NavigationRequestProvider implements AssignableProvider
{
    public function requireAssignable(RecordIdentity $record): Assignable
    {
        return NavigationRequest::query()->acrossActors()->whereKey($record->id)->lock('for key share')->firstOr(
            fn () => throw RecordUnavailable::for($record),
        );
    }

    /**
     * @param  list<RecordIdentity>  $records
     * @return list<RecordIdentity>
     */
    public function visibleRecords(array $records): array
    {
        $found = NavigationRequest::query()
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
        $finished = array_filter(
            $records,
            fn (Assignable $record) => $record instanceof NavigationRequest && ! $record->state->isOpen(),
        );

        return array_values(array_map(fn (Assignable $record) => $record->assignmentIdentity(), $finished));
    }
}
