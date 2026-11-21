<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Reads\Contracts\ReadableModel;
use App\Reflection\Support\Reflector;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Schema;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Every registered model's default read order names only columns its migrated table has, and ends in the table's
 * key, so a page always has one stable order.
 */
final class ReadOrderTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_every_default_read_order_names_real_columns_and_ends_in_the_key(): void
    {
        $faults = [];

        foreach (array_unique(array_values(Relation::morphMap())) as $class) {
            if (! Reflector::factory()->isSubclassOf($class, ReadableModel::class)) {
                continue;
            }

            $model = new $class();
            $columns = $model->defaultReadOrder()->columns;
            $last = end($columns);

            foreach ($columns as $column) {
                [$table, $name] = str_contains($column['column'], '.') ? explode('.', $column['column'], 2) : [
                    $model->getTable(),
                    $column['column'],
                ];

                if (! Schema::hasColumn($table, $name)) {
                    $faults[] = "{$class} orders by {$column['column']}, which {$table} does not have";
                }
            }

            if ($last === false
                || ! str_ends_with($last['column'], '.'.$model->getKeyName())
                && $last['column'] !== $model->getKeyName()) {
                $faults[] = "{$class}'s read order does not end in its key {$model->getKeyName()}";
            }
        }

        $this->assertSame([], $faults);
    }
}
