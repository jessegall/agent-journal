<?php

declare(strict_types=1);

namespace Tests\Support;

use Illuminate\Support\Facades\Schema;

/**
 * Checks that the fresh schema holds every table the test's records are stored in.
 */
trait ChecksSchemaTables
{
    /**
     * @return list<string>
     */
    abstract protected static function storedTables(): array;

    public function test_the_fresh_schema_has_the_tables_its_records_are_stored_in(): void
    {
        foreach (static::storedTables() as $table) {
            $this->assertTrue(Schema::hasTable($table), "{$table} is missing.");
        }
    }
}
