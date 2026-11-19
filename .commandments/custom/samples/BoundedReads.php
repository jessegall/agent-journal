<?php

declare(strict_types=1);

namespace App\Samples;

use Domain\Tasks\Models\Task;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Planted reads the bounded-reads rules must find: an unbounded Model::all, a DB facade read, a builder escape, a
 * read in a loop and a query in an accessor. Beside them, what they must pass: a raw write that forges a row, a query
 * of the database's own catalogue, and a find on a collection in a loop, which reads no table.
 */
final class BoundedReads
{
    public function refusal(): void
    {
        // @righteous ModelReadAllDetector
        $this->assertThrows(fn () => Task::all(), \RuntimeException::class);
    }

    private function assertThrows(\Closure $read, string $refusal): void
    {
        unset($read, $refusal);
    }

    /**
     * @param  list<string>  $ids
     * @param  Collection<string, string>  $owners
     * @return list<string>
     */
    public function titles(array $ids, Collection $owners): array
    {
        $everyTask = Task::all(); // @sin ModelReadAllDetector
        $raw = DB::table('tasks')->get(); // @sin RawTableReadDetector
        $base = Task::query()->toBase(); // @sin QueryEscapeDetector
        $titles = [];

        foreach ($ids as $id) {
            $titles[] = (string) Task::query()->whereKey($id)->first()?->title; // @sin LoadInLoopDetector
            // @righteous LoadInLoopDetector
            $titles[] = (string) $owners->first(fn (string $owner) => $owner === $id);
        }

        // @righteous RawTableReadDetector
        DB::table('tasks')->insert(['id' => 'forged']);
        // @righteous RawTableReadDetector
        DB::select('SELECT pg_stat_clear_snapshot()');

        return [...$titles, (string) $everyTask->count(), (string) $raw->count(), (string) $base->count()];
    }

    // @sin QueryInAccessorDetector
    public function getOpenCountAttribute(): int
    {
        return Task::query()->where('state', 'open')->count();
    }
}
