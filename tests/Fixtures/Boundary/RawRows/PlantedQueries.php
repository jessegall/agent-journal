<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\RawRows;

use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Facades\DB;

/**
 * Raw row access the architecture test must find, beside the schema change and transaction it allows.
 */
final class PlantedQueries
{
    public function run(ConnectionInterface $connection): void
    {
        DB::table('tasks')->get();
        DB::select('select * from plans');
        $connection->table('rules')->delete();
        DB::statement('ALTER TABLE tasks ADD CONSTRAINT tasks_number_positive CHECK (number > 0)');
        DB::transaction(fn () => null);
    }
}
