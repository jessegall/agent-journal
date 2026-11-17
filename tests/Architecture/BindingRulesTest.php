<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Core\Actors\ActorStore;
use App\Core\Contracts\EstablishActor;
use App\Core\CoreApi;
use App\Core\Hooks\Contracts\ShellCommandParser;
use App\Domain\DomainRegistry;
use Tests\Architecture\Support\BindingRules;
use Tests\Architecture\Support\BoundaryReport;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\NameUse;
use Tests\Architecture\Support\ProjectRoots;
use Tests\Architecture\Support\PublicOwner;
use Tests\Architecture\Support\Violation;
use Tests\TestCase;

/**
 * The bindings the code states are sound, Core's parser comes from Processes, and only the authentication sites
 * establish who acts in a request. Closures in providers are not judged.
 */
final class BindingRulesTest extends TestCase
{
    /**
     * The files that may name the actor store or establish an actor: the store, its two contracts, Core's list,
     * the two middleware that authenticate a request and the provider that reads the actor.
     */
    private const array ACTOR_SITES = [
        'app/Core/Actors/ActorStore.php',
        'app/Core/Actors/ActorsServiceProvider.php',
        'app/Core/Contracts/CurrentActor.php',
        'app/Core/Contracts/EstablishActor.php',
        'app/Core/CoreApi.php',
        'app/Core/Agents/Http/Middleware/AuthenticateAgent.php',
        'app/Domain/Access/Http/Middleware/AuthenticateUser.php',
    ];

    public function test_every_stated_binding_of_the_app_is_sound(): void
    {
        $owners = [
            PublicOwner::core(CoreApi::exports()),
            ...array_map(PublicOwner::fromDomain(...), $this->app->make(DomainRegistry::class)->all()),
        ];

        $violations = (new BindingRules($owners, DomainFiles::in([app_path('Core'), app_path('Domain')])))->violations();

        $this->assertSame([], $violations, BoundaryReport::of($violations, base_path()));
    }

    public function test_a_wrong_target_another_owners_contract_and_a_singleton_keeping_the_actor_fail(): void
    {
        $fixtures = base_path('tests/Fixtures/Bindings');
        $owners = [
            PublicOwner::core(CoreApi::exports()),
            new PublicOwner('Plans', 'Tests\Fixtures\Bindings\Plans', []),
            new PublicOwner('Tasks', 'Tests\Fixtures\Bindings\Tasks', []),
        ];

        $violations = (new BindingRules($owners, DomainFiles::in([$fixtures])))->violations();

        $this->assertSame([
            'PlanReader.php:10 binds Tests\Fixtures\Bindings\Plans\Contracts\PlanReader, but Tests\Fixtures\Bindings\Plans\PlanNotes does not implement it',
            'PlansServiceProvider.php:17 binds Tests\Fixtures\Bindings\Tasks\Contracts\TaskReader, but Tasks owns it; only Core\'s public contracts are filled by another owner',
            'PlansServiceProvider.php:18 binds Tests\Fixtures\Bindings\Plans\Contracts\PlanCounter, but the target Tests\Fixtures\Bindings\Tasks\TaskList belongs to Tasks',
            'PlanCounts.php:11 binds Tests\Fixtures\Bindings\Plans\PlanCounts, but the singleton Tests\Fixtures\Bindings\Plans\PlanCounts keeps the per-request App\Core\Contracts\CurrentActor beyond its request',
        ], array_map(fn (Violation $violation) => basename($violation->file).":{$violation->line} {$violation->reason()}", $violations));
    }

    public function test_cores_parser_comes_from_processes(): void
    {
        $this->assertStringStartsWith('App\Domain\Processes\\', $this->app->make(ShellCommandParser::class)::class);
    }

    public function test_only_the_authentication_sites_name_the_actor_store_or_establish_an_actor(): void
    {
        $roots = ProjectRoots::fromComposer(base_path('composer.json'));
        $uses = DomainFiles::usesIn(DomainFiles::in([app_path(), base_path('bootstrap'), base_path('routes')]), $roots);
        $sites = array_map(base_path(...), self::ACTOR_SITES);

        $outside = array_filter($uses, fn (NameUse $use) => in_array(ltrim($use->name, '\\'), [EstablishActor::class, ActorStore::class], true)
            && ! in_array($use->file, $sites, true));

        $this->assertSame([], array_values(array_map(fn (NameUse $use) => "{$use->file}:{$use->line} {$use->name}", $outside)));
    }
}
