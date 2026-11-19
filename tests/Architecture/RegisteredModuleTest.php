<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\CoreApi;
use App\Domains\Support\DomainRegistry;
use Tests\Architecture\Support\BindingRules;
use Tests\Architecture\Support\BoundaryChecker;
use Tests\Architecture\Support\BoundaryReport;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\ModelTables;
use Tests\Architecture\Support\NameType;
use Tests\Architecture\Support\NameUse;
use Tests\Architecture\Support\ProjectRoots;
use Tests\Architecture\Support\PublicContracts;
use Tests\Architecture\Support\PublicOwner;
use Tests\Architecture\Support\TableChecker;
use Tests\Architecture\Support\TableOwner;
use Tests\Architecture\Support\TableScan;
use Tests\Architecture\Support\TableType;
use Tests\Architecture\Support\TableUse;
use Tests\Architecture\Support\Violation;
use Tests\Fixtures\Modules\Cards\CardsDomain;
use Tests\Fixtures\Modules\Notes\Api\NoteValue;
use Tests\Fixtures\Modules\Notes\Contracts\NoteResolver;
use Tests\Fixtures\Modules\Notes\NoteRecords;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Fixtures\Modules\Notes\Providers\NotesServiceProvider;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A module outside the domain folder, registered beside the domains as a package would be, is discovered like a domain
 * and
 * judged by every boundary check in both directions: what it uses, and what others use of it.
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class RegisteredModuleTest extends TestCase
{
    public function test_a_registered_module_is_discovered_with_its_listeners_migrations_and_bindings(): void
    {
        $notes = $this->registry()->get('Notes');

        $this->assertContains($notes->listenerFolder(), $this->registry()->listenerFolders());
        $this->assertFileExists($notes->migrationFolder().'/2026_11_19_000001_create_module_notes.php');

        $this->app->register(NotesServiceProvider::class);

        $this->assertInstanceOf(NoteRecords::class, $this->app->make(NoteResolver::class));
    }

    public function test_the_module_passes_every_boundary_check(): void
    {
        $roots = $this->roots();
        $files = DomainFiles::in([$this->registry()->get('Notes')->folder]);
        $tableUses = [...ModelTables::in($files), ...ScanCache::findings(new TableScan(), $files)];

        $violations = [
            ...$this->boundaryChecker()->violations(DomainFiles::usesIn($files, $roots)),
            ...new PublicContracts($this->publicOwners(), $roots)->violations(),
            ...$this->tableChecker()->violations($tableUses),
            ...new BindingRules($this->publicOwners(), $files)->violations(),
        ];

        $this->assertSame([], $violations, BoundaryReport::of($violations, base_path()));
    }

    public function test_the_module_and_the_domains_are_judged_in_both_directions(): void
    {
        $plansFile = base_path('domain/Plans/src/UsesNotes.php');
        $notesFile = $this->registry()->get('Notes')->folder.'/UsesTasks.php';

        $names = $this->boundaryChecker()->violations([
            new NameUse($plansFile, 3, NoteValue::class, NameType::Type),
            new NameUse($notesFile, 4, 'Domain\Tasks\Models\Task', NameType::Type),
            new NameUse($notesFile, 5, 'App\Hooks\Actions\AgentStacks', NameType::Type),
        ]);
        $tables = $this->tableChecker()->violations([
            new TableUse($plansFile, 6, 'module_notes', TableType::Read),
            new TableUse($notesFile, 7, 'tasks', TableType::Read),
        ]);

        $this->assertSame([
            '3 uses Tests\Fixtures\Modules\Notes\Api\NoteValue, but Plans does not require Notes',
            '4 uses Domain\Tasks\Models\Task, but Notes does not require Tasks',
            '5 uses App\Hooks\Actions\AgentStacks, which is private to Core; list it in CoreApi if it is meant to be '
                .'public, or use what CoreApi lists',
            '6 uses table module_notes of Notes; only Notes reads, joins, keys or changes its tables, so use what '
                .'Notes exports',
            '7 uses table tasks of Tasks; only Tasks reads, joins, keys or changes its tables, so use what Tasks '
                .'exports',
        ], array_map(
            fn (Violation $violation) => "{$violation->line} {$violation->reason()}",
            [...$names, ...$tables],
        ));
    }

    private function registry(): DomainRegistry
    {
        $domainClasses = DomainRegistry::installedClasses(base_path());

        return DomainRegistry::from([...$domainClasses, CardsDomain::class, NotesDomain::class]);
    }

    private function roots(): ProjectRoots
    {
        return ProjectRoots::fromComposer(base_path('composer.json'));
    }

    private function boundaryChecker(): BoundaryChecker
    {
        return new BoundaryChecker($this->registry()->all(), $this->roots(), CoreApi::exports());
    }

    private function tableChecker(): TableChecker
    {
        $owners = [TableOwner::core(app_path()), ...array_map(TableOwner::fromDomain(...), $this->registry()->all())];

        return TableChecker::for($owners, database_path('migrations'));
    }

    /**
     * @return list<PublicOwner>
     */
    private function publicOwners(): array
    {
        return [
            PublicOwner::core(CoreApi::exports()),
            ...array_map(PublicOwner::fromDomain(...), $this->registry()->all()),
        ];
    }
}
