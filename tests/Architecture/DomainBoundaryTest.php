<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\CoreApi;
use App\Domains\Support\Domain;
use App\Domains\Support\DomainRegistry;
use Tests\Architecture\Support\BoundaryChecker;
use Tests\Architecture\Support\BoundaryReport;
use Tests\Architecture\Support\CompositionSite;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\ProjectRoots;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every domain uses only its own code, App\Domain, App\Core, code outside the project, and the domains it declares.
 * The core uses no domain.
 * It does not see class names built at run time, class names read from config, relation chains
 * on untyped models, morph alias lookups, raw SQL text, where on tasks.id and select on tasks.*, Blade views,
 * the folders routes, config, bootstrap and database beyond the composition files and the root migrations rule, edits
 * inside the listed
 * starter-kit files beyond their domain names, a received event re-raised through a copied variable or another
 * method, a query built in another file and passed in, and a string passed to ->dispatch() on an injected dispatcher.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of the project.')]
final class DomainBoundaryTest extends TestCase
{
    public function test_no_domain_crosses_its_boundary(): void
    {
        $registry = $this->app->make(DomainRegistry::class);
        $roots = ProjectRoots::fromComposer(base_path('composer.json'));
        $folders = [app_path(), ...DomainFiles::domainCode()];

        $violations = new BoundaryChecker($registry->all(), $roots, CoreApi::exports())
            ->violations(DomainFiles::usesIn(DomainFiles::in($folders), $roots));

        $this->assertSame([], $violations, BoundaryReport::of($violations, base_path()));
    }

    public function test_the_composition_files_name_only_what_they_compose(): void
    {
        $registry = $this->app->make(DomainRegistry::class);
        $roots = ProjectRoots::fromComposer(base_path('composer.json'));

        $violations = new BoundaryChecker($registry->all(), $roots, CoreApi::exports())
            ->compositionViolations(DomainFiles::usesIn(CompositionSite::files(base_path()), $roots), base_path());

        $this->assertSame([], $violations, BoundaryReport::of($violations, base_path()));
    }
}
