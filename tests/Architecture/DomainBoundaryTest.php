<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Support\Domain;
use App\Support\DomainRegistry;
use Domain\Plans\Support\PlanStructureEditor;
use Tests\Architecture\Support\BoundaryChecker;
use Tests\Architecture\Support\BoundaryReport;
use Tests\Architecture\Support\BoundaryRoots;
use Tests\Architecture\Support\CompositionSite;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\ProjectRoots;
use Tests\Architecture\Support\Violation;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Every domain uses only its own code, App\Domain, App\Core, outside code and the domains it declares, and the core
 * uses no domain. What its class scan cannot see, such as class names built at run time or raw SQL, is listed in
 * docs/domains/boundary-scan.md.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of the project.')]
final class DomainBoundaryTest extends TestCase
{
    #[TimeLimit(seconds: 45, reason: 'A cold cache resolves names in code, strings and docblocks across domains.')]
    public function test_no_domain_crosses_its_boundary(): void
    {
        $registry = $this->app->make(DomainRegistry::class);
        $roots = ProjectRoots::fromComposer(base_path('composer.json'));
        $violations = $this->checker($registry)->violations(DomainFiles::usesIn($this->scannedFiles($registry), $roots));

        $this->assertSame([], $violations, BoundaryReport::of($violations, base_path()));
    }

    public function test_the_root_seeder_may_call_seeders_only(): void
    {
        $registry = $this->app->make(DomainRegistry::class);
        $roots = ProjectRoots::fromComposer(base_path('composer.json'));
        $seeder = base_path(CompositionSite::Seeders->value);
        $original = (string) file_get_contents($seeder);
        $planted = PlanStructureEditor::class;

        try {
            file_put_contents($seeder, str_replace('use Illuminate\\Database\\Seeder;', "use Illuminate\\Database\\Seeder;\nuse {$planted};", $original));
            $violations = $this->checker($registry)->compositionViolations(DomainFiles::usesIn([$seeder], $roots), base_path());
        } finally {
            file_put_contents($seeder, $original);
        }

        $this->assertSame([$planted], array_map(fn (Violation $violation) => $violation->subject, $violations));
        $this->assertNotContains($seeder, $this->scannedFiles($registry));
    }

    public function test_routes_seeders_and_core_migrations_are_scanned_and_owned(): void
    {
        $registry = $this->app->make(DomainRegistry::class);
        $route = base_path('domain/Tasks/routes/boundary-probe.php');
        $seeder = base_path('database/seeders/BoundaryProbeSeeder.php');
        $private = PlanStructureEditor::class;
        $routeFolderExisted = is_dir(dirname($route));
        $routeFolderExisted || mkdir(dirname($route), 0777, true);
        file_put_contents($route, "<?php\n\nuse {$private};\n");
        file_put_contents($seeder, "<?php\n\nnamespace Database\\Seeders;\n\nuse {$private};\n");

        try {
            $roots = ProjectRoots::fromComposer(base_path('composer.json'));
            $files = $this->scannedFiles($registry);
            $violations = $this->checker($registry)->violations(DomainFiles::usesIn([$route, $seeder], $roots));
            $flagged = array_values(array_unique(array_map(fn (Violation $violation) => $violation->file, $violations)));
            sort($flagged);
            $numbers = glob(base_path('database/migrations/0001_01_01_000001_create_number_groups_tables.php')) ?: [];

            $this->assertCount(1, $numbers);
            $this->assertContains($numbers[0], $files);
            $this->assertSame([$seeder, $route], $flagged);
        } finally {
            unlink($route);
            unlink($seeder);
            $routeFolderExisted || rmdir(dirname($route));
        }
    }

    /**
     * The code roots, Core's and every package's routes and seeders, and the Core migrations, less the composition
     * files, which test_the_composition_files_name_only_what_they_compose judges on their own terms.
     *
     * @return list<string>
     */
    private function scannedFiles(DomainRegistry $registry): array
    {
        $extra = new BoundaryRoots($registry->all(), base_path());
        $folders = [app_path(), ...DomainFiles::domainCode(), ...$extra->folders()];

        return array_values(array_diff(DomainFiles::in($folders), CompositionSite::files(base_path())));
    }

    private function checker(DomainRegistry $registry): BoundaryChecker
    {
        return new BoundaryChecker(
            $registry->all(),
            ProjectRoots::fromComposer(base_path('composer.json')),
            new BoundaryRoots($registry->all(), base_path()),
        );
    }

    public function test_the_composition_files_name_only_what_they_compose(): void
    {
        $registry = $this->app->make(DomainRegistry::class);
        $roots = ProjectRoots::fromComposer(base_path('composer.json'));

        $violations = new BoundaryChecker($registry->all(), $roots)
            ->compositionViolations(DomainFiles::usesIn(CompositionSite::files(base_path()), $roots), base_path());

        $this->assertSame([], $violations, BoundaryReport::of($violations, base_path()));
    }
}
