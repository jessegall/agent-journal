<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Domains\Support\DomainEntry;
use App\Domains\Support\DomainRegistry;
use Tests\Architecture\Support\BoundaryReport;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\ModelTables;
use Tests\Architecture\Support\ParsedFile;
use Tests\Architecture\Support\TableChecker;
use Tests\Architecture\Support\TableOwner;
use Tests\Architecture\Support\TableScan;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every domain and Core uses only its own tables; another owner's table is reached through what that owner exports.
 * It does not see raw SQL text, a column named with its table such as where('tasks.id') or
 * select('tasks.*'), and a query built in another file and passed in.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of the project.')]
final class DomainTableBoundaryTest extends TestCase
{
    public function test_no_domain_uses_a_table_it_may_not(): void
    {
        $registry = $this->app->make(DomainRegistry::class);
        $owners = [TableOwner::core(app_path()), ...array_map(TableOwner::fromDomain(...), $registry->all())];
        $checker = TableChecker::for($owners, database_path('migrations'));
        $files = DomainFiles::in([app_path(), ...array_map(fn (DomainEntry $entry) => $entry->folder, $registry->all())]);
        $uses = ModelTables::in($files);

        foreach ($files as $file) {
            array_push($uses, ...TableScan::of(ParsedFile::fromPath($file)));
        }

        $violations = [...$checker->violations($uses), ...$checker->migrationViolations()];

        $this->assertSame([], $violations, BoundaryReport::of($violations, base_path()));
    }
}
