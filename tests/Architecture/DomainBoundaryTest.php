<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Domain\Domain;
use App\Domain\DomainRegistry;
use Tests\Architecture\Support\BoundaryChecker;
use Tests\Architecture\Support\BoundaryReport;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\ProjectRoots;
use Tests\TestCase;

/**
 * Every domain uses only its own code, App\Domain, code outside the project, and the domains it declares.
 *
 * What this test does not see: class names built at run time, class names read from config, relation chains
 * on untyped models, morph alias lookups, raw SQL text, where on tasks.id and select on tasks.*, Blade views,
 * the folders routes, config, bootstrap and database outside the root migrations rule, edits inside the listed
 * starter-kit files beyond their domain names, a received event re-raised through a copied variable or another
 * method, a query built in another file and passed in, and a string passed to ->dispatch() on an injected dispatcher.
 */
final class DomainBoundaryTest extends TestCase
{
    public function test_no_domain_crosses_its_boundary(): void
    {
        $registry = $this->app->make(DomainRegistry::class);
        $roots = ProjectRoots::fromComposer(base_path('composer.json'));
        $folders = [dirname((string) (new \ReflectionClass(Domain::class))->getFileName())];

        $violations = (new BoundaryChecker($registry->all(), $roots))
            ->violations(DomainFiles::usesIn(DomainFiles::in($folders), $roots));

        $this->assertSame([], $violations, BoundaryReport::of($violations, base_path()));
    }
}
