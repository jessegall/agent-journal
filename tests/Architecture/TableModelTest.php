<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Reflection\Support\Reflector;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Facades\Schema;
use Tests\Architecture\Support\DomainFiles;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every table a create migration makes has a model (rule 25; rule 34 keeps every change inside the create migration),
 * and a pivot table's model is a Pivot (rule 33), judged by the columns of the migrated test database.
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class TableModelTest extends TestCase
{
    use RefreshHookDatabase;

    /**
     * Columns every table may carry besides the references that make it a pivot.
     */
    private const array PIVOT_BOOKKEEPING_COLUMNS = ['id', 'created_at', 'updated_at', 'position'];

    public function test_every_migrated_table_has_a_model(): void
    {
        $missing = array_values(array_diff($this->migratedTables(), array_keys($this->modelOfTable())));

        $this->assertSame([], $missing, 'Give each of these tables an Eloquent model (rule 25).');
    }

    public function test_every_pivot_table_has_a_pivot_model(): void
    {
        $notPivots = [];

        foreach ($this->modelOfTable() as $table => $model) {
            if ($this->isPivotTable($table) && ! Reflector::of($model)->isSubclassOf(Pivot::class)) {
                $notPivots[] = "{$table} ({$model})";
            }
        }

        $this->assertSame(
            [],
            $notPivots,
            'Make the model of each of these pivot tables extend Pivot or MorphPivot (rule 33).',
        );
    }

    /**
     * @return list<string>
     */
    private function migratedTables(): array
    {
        $tables = [];

        foreach (DomainFiles::in([...(glob(app_path('*/Database/Migrations'), GLOB_ONLYDIR)
            ?: []), ...(glob(base_path('domain/*/database/migrations'), GLOB_ONLYDIR)
            ?: [])]) as $migration) {
            preg_match_all("/Schema::create\\('([a-z_]+)'/", (string) file_get_contents($migration), $created);
            array_push($tables, ...$created[1]);
        }

        return array_values(array_unique($tables));
    }

    /**
     * A table whose columns, besides its key, timestamps and an ordering column, are the references to the two records
     * it joins: two id columns, each with its type column when that side is polymorphic.
     */
    private function isPivotTable(string $table): bool
    {
        $columns = array_values(array_diff(Schema::getColumnListing($table), self::PIVOT_BOOKKEEPING_COLUMNS));
        $references = array_filter($columns, fn (string $column) => str_ends_with($column, '_id'));
        $types = array_filter($columns, fn (string $column) => str_ends_with($column, '_type'));
        $matchedTypes = array_filter(
            $types,
            fn (string $type) => in_array(substr($type, 0, -5).'_id', $references, true),
        );

        return count($references) === 2
            && count($matchedTypes) === count($types)
            && count($references) + count($types) === count($columns);
    }

    /**
     * @return array<string, class-string<Model>>
     */
    private function modelOfTable(): array
    {
        $models = [];

        foreach (DomainFiles::in([app_path(), ...DomainFiles::domainCode()]) as $file) {
            if (! str_contains($file, '/Models/')
                || preg_match('/^namespace ([^;]+);/m', (string) file_get_contents($file), $namespace) !== 1) {
                continue;
            }

            $class = $namespace[1].'\\'.basename($file, '.php');

            if (Reflector::isNameSubclassOf($class, Model::class) && Reflector::of($class)->not()->isAbstract()) {
                $models[new $class()->getTable()] = $class;
            }
        }

        return $models;
    }
}
