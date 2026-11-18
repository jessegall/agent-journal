<?php

declare(strict_types=1);

namespace App\Samples;

use Domain\Tasks\Models\Task;
use Illuminate\Support\Facades\DB;

/**
 * Planted reads the bounded-reads rules must find: an unbounded Model::all, a DB facade read, a builder escape, a
 * read in a loop and a query in an accessor.
 */
final class BoundedReads
{
    /**
     * @param  list<string>  $ids
     * @return list<string>
     */
    public function titles(array $ids): array
    {
        $everyTask = Task::all();
        $raw = DB::table('tasks')->get();
        $base = Task::query()->toBase();
        $titles = [];

        foreach ($ids as $id) {
            $titles[] = (string) Task::query()->whereKey($id)->first()?->title;
        }

        return [...$titles, (string) $everyTask->count(), (string) $raw->count(), (string) $base->count()];
    }

    public function getOpenCountAttribute(): int
    {
        return Task::query()->where('state', 'open')->count();
    }
}
