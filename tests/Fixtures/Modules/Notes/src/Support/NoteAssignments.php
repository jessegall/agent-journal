<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes\Support;

use App\Assignments\Contracts\Assignable;
use App\Assignments\Contracts\AssignableProvider;
use App\Exceptions\RecordUnavailable;
use App\Support\RecordIdentity;
use Illuminate\Container\Attributes\Scoped;
use Tests\Fixtures\Modules\Notes\Models\Note;

/**
 * Notes as assignable records: an agent sees only the notes it wrote and a user sees every note, and a note has no end,
 * so its work is never over.
 */
#[Scoped]
final readonly class NoteAssignments implements AssignableProvider
{
    public function requireAssignable(RecordIdentity $record): Assignable
    {
        return Note::query()->forActor()->whereKey(
            $record->id,
        )->lock('for key share')->firstOr(fn () => throw RecordUnavailable::for($record));
    }

    /**
     * @param  list<RecordIdentity>  $records
     * @return list<RecordIdentity>
     */
    public function visibleRecords(array $records): array
    {
        $found = Note::query()->forActor()->whereKey(
            array_map(fn (RecordIdentity $record) => $record->id, $records),
        )->pluck('id')->all();

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
