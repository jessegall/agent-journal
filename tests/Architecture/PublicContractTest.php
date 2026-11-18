<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\CoreApi;
use App\Domains\Support\DomainRegistry;
use Tests\Architecture\Support\BoundaryReport;
use Tests\Architecture\Support\ProjectRoots;
use Tests\Architecture\Support\PublicContracts;
use Tests\Architecture\Support\PublicOwner;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * What every domain and Core exports is a type of type an owner may publish, and its public signatures show nothing
 * private: no model, no service and no other owner's value.
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class PublicContractTest extends TestCase
{
    public function test_every_export_is_publishable_and_shows_nothing_private(): void
    {
        $owners = [
            PublicOwner::core(CoreApi::exports()),
            ...array_map(PublicOwner::fromDomain(...), $this->app->make(DomainRegistry::class)->all()),
        ];

        $violations = new PublicContracts($owners, ProjectRoots::fromComposer(base_path('composer.json')))->violations();

        $this->assertSame([], $violations, BoundaryReport::of($violations, base_path()));
    }
}
