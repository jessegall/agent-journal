<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorStore;
use App\Assignments\Contracts\AssignmentRegistration;
use App\Assignments\Registry\AssignmentRegistry;
use App\CoreApi;
use App\Domains\Support\DomainRegistry;
use App\Exports\Support\Exports;
use App\Processes\Contracts\ShellCommandParser;
use Tests\Architecture\Support\BindingRules;
use Tests\Architecture\Support\BoundaryReport;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\NameUse;
use Tests\Architecture\Support\ProjectRoots;
use Tests\Architecture\Support\PublicOwner;
use Tests\Architecture\Support\Violation;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The bindings the code states are sound, Core's parser comes from Processes, and only the authentication sites
 * set who acts in a request. Closures in providers are not judged.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of the project.')]
final class BindingRulesTest extends TestCase
{
    /**
     * The files that may name the actor store or set the actor: the store, its two contracts, Core's list,
     * the two middleware that authenticate a request, the host middleware and the host enrollment command, the engine
     * pass that signs the engine in, the provider that reads the actor and the public share bridge, which acts as the
     * system around its one read.
     */
    private const array ACTOR_SITES = [
        'app/Actors/Support/ActorStore.php',
        'app/Actors/Providers/ActorsServiceProvider.php',
        'app/Actors/Contracts/CurrentActor.php',
        'app/Actors/Contracts/CurrentActorSetter.php',
        'app/CoreApi.php',
        'app/Http/Middleware/Agents/AuthenticateAgent.php',
        'app/Http/Controllers/Sharing/ReadShareController.php',
        'app/Http/Middleware/Agents/AuthenticateHost.php',
        'app/Agents/Console/EnrollHostCommand.php',
        'domain/Access/Http/Middleware/AuthenticateUser.php',
        'app/Engine/Support/EnginePass.php',
    ];

    /**
     * The files that compose the application and may register assignable record types and actor types: the contract,
     * the registry, Core's list, the providers of Core's assignment and agent areas, and the domain foundation.
     */
    private const array ASSIGNMENT_REGISTRATION_SITES = [
        'app/Assignments/Contracts/AssignmentRegistration.php',
        'app/Assignments/Registry/AssignmentRegistry.php',
        'app/Assignments/Providers/AssignmentsServiceProvider.php',
        'app/Agents/Providers/AgentsServiceProvider.php',
        'app/CoreApi.php',
        'app/Domains/Bootstrappers/RegisterAssignables.php',
    ];

    public function test_every_stated_binding_of_the_app_is_sound(): void
    {
        $owners = [
            PublicOwner::core(CoreApi::exports()),
            ...array_map(PublicOwner::fromDomain(...), $this->app->make(DomainRegistry::class)->all()),
        ];

        $violations = (new BindingRules($owners, DomainFiles::in([app_path(), ...DomainFiles::domainCode()])))->violations();

        $this->assertSame([], $violations, BoundaryReport::of($violations, base_path()));
    }

    public function test_a_wrong_target_another_owners_contract_and_a_singleton_keeping_the_actor_fail(): void
    {
        $fixtures = base_path('tests/Fixtures/Bindings');
        $owners = [
            PublicOwner::core(CoreApi::exports()),
            new PublicOwner('Plans', 'Tests\Fixtures\Bindings\Plans', Exports::make()->build()),
            new PublicOwner('Tasks', 'Tests\Fixtures\Bindings\Tasks', Exports::make()->build()),
        ];

        $violations = (new BindingRules($owners, DomainFiles::in([$fixtures])))->violations();

        $this->assertSame([
            'PlanReader.php:10 binds Tests\Fixtures\Bindings\Plans\Contracts\PlanReader, but Tests\Fixtures\Bindings\Plans\PlanNotes does not implement it',
            'PlansServiceProvider.php:17 binds Tests\Fixtures\Bindings\Tasks\Contracts\TaskReader, but Tasks owns it; only Core\'s public contracts are filled by another owner',
            'PlansServiceProvider.php:18 binds Tests\Fixtures\Bindings\Plans\Contracts\PlanCounter, but the target Tests\Fixtures\Bindings\Tasks\TaskList belongs to Tasks',
            'PlanCounts.php:11 binds Tests\Fixtures\Bindings\Plans\PlanCounts, but the singleton Tests\Fixtures\Bindings\Plans\PlanCounts keeps the per-request App\Actors\Contracts\CurrentActor beyond its request',
        ], array_map(fn (Violation $violation) => basename($violation->file).":{$violation->line} {$violation->reason()}", $violations));
    }

    public function test_cores_parser_comes_from_processes(): void
    {
        $this->assertStringStartsWith('App\Processes\\', $this->app->make(ShellCommandParser::class)::class);
    }

    public function test_only_the_authentication_sites_name_the_actor_store_or_set_the_actor(): void
    {
        $roots = ProjectRoots::fromComposer(base_path('composer.json'));
        $uses = DomainFiles::usesIn(DomainFiles::in([app_path(), base_path('bootstrap'), base_path('routes')]), $roots);
        $sites = array_map(base_path(...), self::ACTOR_SITES);

        $outside = array_filter($uses, fn (NameUse $use) => in_array(ltrim($use->name, '\\'), [CurrentActorSetter::class, ActorStore::class], true)
            && ! in_array($use->file, $sites, true));

        $this->assertSame([], array_values(array_map(fn (NameUse $use) => "{$use->file}:{$use->line} {$use->name}", $outside)));
    }

    public function test_only_the_composition_sites_register_assignable_types_and_actor_types(): void
    {
        $roots = ProjectRoots::fromComposer(base_path('composer.json'));
        $uses = DomainFiles::usesIn(DomainFiles::in([app_path(), base_path('bootstrap'), base_path('routes')]), $roots);
        $sites = array_map(base_path(...), self::ASSIGNMENT_REGISTRATION_SITES);

        $outside = array_filter($uses, fn (NameUse $use) => in_array(ltrim($use->name, '\\'), [AssignmentRegistration::class, AssignmentRegistry::class], true)
            && ! in_array($use->file, $sites, true));

        $this->assertSame([], array_values(array_map(fn (NameUse $use) => "{$use->file}:{$use->line} {$use->name}", $outside)));
    }
}
