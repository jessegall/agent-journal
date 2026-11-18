<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Illuminate\Database\Eloquent\Model;
use Laravel\Passkeys\Passkey;
use ReflectionClass;
use Tests\Architecture\Support\DomainFiles;
use Tests\TestCase;

/**
 * Every table a migration creates has a model, and code reaches it through that model (rule 25).
 */
final class TableModelTest extends TestCase
{
    /**
     * Laravel's own storage tables, kept by the framework rather than the journal's code.
     */
    private const array FRAMEWORK_TABLES = ['cache', 'cache_locks', 'failed_jobs', 'job_batches', 'jobs', 'password_reset_tokens', 'sessions'];

    /**
     * Models a package ships for a table the journal migrates.
     */
    private const array PACKAGE_MODELS = [Passkey::class];

    public function test_every_migrated_table_has_a_model(): void
    {
        $modelled = $this->modelTables();
        $missing = array_values(array_diff($this->migratedTables(), $modelled, self::FRAMEWORK_TABLES));

        $this->assertSame([], $missing, 'Give each of these tables an Eloquent model (rule 25).');
    }

    /**
     * @return list<string>
     */
    private function migratedTables(): array
    {
        $tables = [];
        $folders = [base_path('database/migrations'), ...(glob(app_path('*/Database/Migrations'), GLOB_ONLYDIR) ?: []), ...(glob(base_path('domain/*/database/migrations'), GLOB_ONLYDIR) ?: [])];

        $renamed = [];

        foreach (DomainFiles::in($folders) as $migration) {
            $source = (string) file_get_contents($migration);
            preg_match_all("/Schema::create\\('([a-z_]+)'/", $source, $created);
            preg_match_all("/Schema::rename\\('([a-z_]+)', '([a-z_]+)'\\)/", $source, $renames, PREG_SET_ORDER);
            array_push($tables, ...$created[1]);

            foreach ($renames as $rename) {
                $renamed[$rename[1]] = $rename[2];
            }
        }

        // A table a later migration renamed is checked under the name it has now.
        $tables = array_values(array_unique(array_map(fn (string $table) => $renamed[$table] ?? $table, $tables)));
        sort($tables);

        return $tables;
    }

    /**
     * @return list<string>
     */
    private function modelTables(): array
    {
        $tables = array_map(fn (string $model) => (new $model)->getTable(), self::PACKAGE_MODELS);

        foreach (DomainFiles::in([app_path(), ...DomainFiles::domainCode()]) as $file) {
            if (! str_contains($file, '/Models/') || preg_match('/^namespace ([^;]+);/m', (string) file_get_contents($file), $namespace) !== 1) {
                continue;
            }

            $class = $namespace[1].'\\'.basename($file, '.php');

            if (class_exists($class) && is_subclass_of($class, Model::class) && ! (new ReflectionClass($class))->isAbstract()) {
                $tables[] = (new $class)->getTable();
            }
        }

        return array_values(array_unique($tables));
    }
}
