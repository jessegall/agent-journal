<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Domains\DomainRegistry;
use Tests\Architecture\Support\ModelTables;
use Tests\Architecture\Support\ParsedFile;
use Tests\Architecture\Support\TableChecker;
use Tests\Architecture\Support\TableScan;
use Tests\Architecture\Support\Violation;
use Tests\Fixtures\Boundary\Tables\Chat\ChatDomain;
use Tests\Fixtures\Boundary\Tables\Plans\PlansDomain;
use Tests\Fixtures\Boundary\Tables\Tasks\TasksDomain;
use Tests\TestCase;

final class TableCheckerTest extends TestCase
{
    public function test_queries_pass_on_own_and_declared_tables_and_fail_on_the_rest(): void
    {
        $this->assertSame([
            '21 uses table messages of Chat, but Plans does not require Chat',
            '22 uses table users, which no domain owns',
            '23 uses table links, which only Links may use',
            '24 names a table with $name; write the table name out',
            '25 names a table with self::TABLE; write the table name out',
            '27 uses table messages of Chat, but Plans does not require Chat',
        ], $this->violationLines('Plans/Queries.php'));
    }

    public function test_a_migration_keys_declared_tables_but_changes_only_its_own(): void
    {
        $this->assertSame(
            ['26 changes table tasks, which Tasks owns'],
            $this->violationLines('Plans/Database/Migrations/2026_01_03_000000_create_plans_table.php'),
        );
    }

    public function test_an_omitted_pivot_fails_and_a_written_own_pivot_passes(): void
    {
        $this->assertSame(
            ['20 leaves the pivot table of $this->belongsToMany(\\Tests\\Fixtures\\Boundary\\Tables\\Tasks\\Models\\Task::class) to Laravel; write it out'],
            $this->violationLines('Plans/Models/Plan.php'),
        );
    }

    public function test_a_model_table_must_belong_to_the_model_domain(): void
    {
        $files = [$this->folder('Plans/Models/Plan.php'), $this->folder('Plans/Models/StrayMessage.php')];

        $this->assertSame(
            ['11 has model table messages, which Chat owns'],
            $this->lines($this->checker()->violations(ModelTables::in($files))),
        );
    }

    public function test_migrations_are_judged_across_domains_and_the_root_folder(): void
    {
        $reasons = array_map(fn (Violation $violation) => $violation->reason(), $this->checker()->migrationViolations());

        $this->assertContains('creates table notes, which '.$this->folder('Chat/Database/Migrations/2026_01_01_000000_create_tasks_table.php').' also creates', $reasons);
        $this->assertContains('has the migration file name 2026_01_01_000000_create_tasks_table.php, as does '.$this->folder('Chat/Database/Migrations/2026_01_01_000000_create_tasks_table.php'), $reasons);
        $this->assertContains('changes table tasks of Tasks from database/migrations', $reasons);
        $this->assertCount(3, $reasons);
    }

    /**
     * @return list<string>
     */
    private function violationLines(string $fixture): array
    {
        return $this->lines($this->checker()->violations(TableScan::of(ParsedFile::fromPath($this->folder($fixture)))));
    }

    /**
     * @param  list<Violation>  $violations
     * @return list<string>
     */
    private function lines(array $violations): array
    {
        return array_map(fn (Violation $violation) => "{$violation->line} {$violation->reason()}", $violations);
    }

    private function checker(): TableChecker
    {
        return TableChecker::for($this->registry()->all(), $this->folder('RootMigrations'));
    }

    private function registry(): DomainRegistry
    {
        return DomainRegistry::from([TasksDomain::class, ChatDomain::class, PlansDomain::class]);
    }

    private function folder(string $path): string
    {
        return dirname($this->registry()->get('Tasks')->folder).'/'.$path;
    }
}
