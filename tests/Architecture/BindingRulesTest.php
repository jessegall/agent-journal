<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Assignments\AssignmentRegistration;
use App\Contracts\Processes\ShellCommandParser as ShellCommandParserContract;
use App\Support\ActorStore;
use App\Support\DomainRegistry;
use App\Support\Exports;
use App\Support\Registry\AssignmentRegistry;
use App\Support\ShellCommandParser;
use Tests\Architecture\Support\BindingRules;
use Tests\Architecture\Support\BoundaryReport;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\NameUse;
use Tests\Architecture\Support\ProjectRoots;
use Tests\Architecture\Support\PublicOwner;
use Tests\Architecture\Support\Violation;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * The bindings the code states are sound, Core's parser comes from Processes, and only the authentication sites
 * set who acts in a request. Closures in providers are not judged.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of the project.')]
final class BindingRulesTest extends TestCase
{
    use RefreshHookDatabase;

    /**
     * The files that may name the actor store or set the actor: the store, its two contracts, Core's list,
     * the two middleware that authenticate a request, the host middleware and the host enrollment command, the engine
     * pass that signs the engine in, the provider that reads the actor, the public share bridge, which acts as the
     * system around its one read, and the skill console owner, publisher and refresh listener, which act as the owner
     * or the system the same way the sharing console owner and supervisor do.
     */
    private const array ACTOR_SITES = [
        'app/Support/ActorStore.php',
        'app/Providers/ActorsServiceProvider.php',
        'app/Contracts/Actors/CurrentActor.php',
        'app/Contracts/Actors/CurrentActorSetter.php',
        'app/Http/Middleware/Agents/AuthenticateAgent.php',
        'app/Http/Middleware/Agents/AuthenticateHost.php',
        'app/Http/Middleware/AuthenticateDeviceGrant.php',
        'app/Support/ConsoleOwner.php',
        'app/Support/JournalCommands.php',
        'app/Http/Middleware/AuthenticateUser.php',
        'app/Support/EnginePass.php',
        'app/Listeners/RefreshOnSkillsChanged.php',
        'app/Support/BuiltInStartProfiles.php',
    ];

    /**
     * The files that compose the application and may register assignable record types and actor types: the contract,
     * the registry, Core's composition root, its area providers, and the domain foundation.
     */
    private const array ASSIGNMENT_REGISTRATION_SITES = [
        'app/Contracts/Assignments/AssignmentRegistration.php',
        'app/Support/Registry/AssignmentRegistry.php',
        'app/Providers/AssignmentsServiceProvider.php',
        'app/Providers/AgentsServiceProvider.php',
        'app/Providers/AccessServiceProvider.php',
        'app/Providers/CommunicationServiceProvider.php',
        'app/Providers/CoreServiceProvider.php',
        'app/Support/Bootstrappers/RegisterAssignables.php',
    ];

    public function test_every_stated_binding_of_the_app_is_sound(): void
    {
        $owners = [
            PublicOwner::core(Exports::everythingIn('App')),
            ...array_map(PublicOwner::fromDomain(...), $this->app->make(DomainRegistry::class)->all()),
        ];

        $violations = new BindingRules(
            $owners,
            DomainFiles::in([app_path(), ...DomainFiles::domainCode()]),
        )->violations();

        $this->assertSame([], $violations, BoundaryReport::of($violations, base_path()));
    }

    public function test_a_bound_interface_a_wrong_target_a_foreign_contract_and_an_actor_keeping_singleton_fail(): void
    {
        $fixtures = base_path('tests/Fixtures/Bindings');
        $owners = [
            PublicOwner::core(Exports::everythingIn('App')),
            new PublicOwner('Plans', 'Tests\Fixtures\Bindings\Plans', Exports::make()->build()),
            new PublicOwner('Tasks', 'Tests\Fixtures\Bindings\Tasks', Exports::make()->build()),
        ];

        $violations = new BindingRules($owners, DomainFiles::in([$fixtures]))->violations();

        $this->assertSame([
            "PlanResolver.php:10 binds Tests\\Fixtures\\Bindings\\Plans\\Contracts\\PlanResolver, but an interface names no implementation; its area's service provider binds it",
            'PlansServiceProvider.php:18 binds Tests\\Fixtures\\Bindings\\Plans\\Contracts\\PlanResolver, but Tests\\Fixtures\\Bindings\\Plans\\PlanNotes does not implement it',
            "PlansServiceProvider.php:19 binds Tests\\Fixtures\\Bindings\\Tasks\\Contracts\\TaskResolver, but Tasks owns it; only Core's public contracts are filled by another owner",
            'PlansServiceProvider.php:20 binds Tests\\Fixtures\\Bindings\\Plans\\Contracts\\PlanCounter, but the target Tests\\Fixtures\\Bindings\\Tasks\\TaskList belongs to Tasks',
            'PlanCounts.php:11 binds Tests\\Fixtures\\Bindings\\Plans\\PlanCounts, but the singleton Tests\\Fixtures\\Bindings\\Plans\\PlanCounts keeps the per-request App\\Contracts\\Actors\\CurrentActor beyond its request',
        ], array_map(
            fn (Violation $violation) => basename($violation->file).":{$violation->line} {$violation->reason()}",
            $violations,
        ));
    }

    public function test_cores_parser_is_the_shell_parser(): void
    {
        $this->assertInstanceOf(ShellCommandParser::class, $this->app->make(ShellCommandParserContract::class));
    }

    public function test_only_the_authentication_sites_name_the_actor_store_or_set_the_actor(): void
    {
        $roots = ProjectRoots::fromComposer(base_path('composer.json'));
        $uses = DomainFiles::usesIn(DomainFiles::in([app_path(), base_path('bootstrap'), base_path('routes')]), $roots);
        $sites = array_map(base_path(...), self::ACTOR_SITES);

        $outside = array_filter($uses, fn (NameUse $use) => in_array(
            ltrim($use->name, '\\'),
            [CurrentActorSetter::class, ActorStore::class],
            true,
        )
            && ! in_array($use->file, $sites, true));

        $this->assertSame(
            [],
            array_values(array_map(fn (NameUse $use) => "{$use->file}:{$use->line} {$use->name}", $outside)),
        );
    }

    public function test_only_the_composition_sites_register_assignable_types_and_actor_types(): void
    {
        $roots = ProjectRoots::fromComposer(base_path('composer.json'));
        $uses = DomainFiles::usesIn(DomainFiles::in([app_path(), base_path('bootstrap'), base_path('routes')]), $roots);
        $sites = array_map(base_path(...), self::ASSIGNMENT_REGISTRATION_SITES);

        $outside = array_filter($uses, fn (NameUse $use) => in_array(
            ltrim($use->name, '\\'),
            [AssignmentRegistration::class, AssignmentRegistry::class],
            true,
        )
            && ! in_array($use->file, $sites, true));

        $this->assertSame(
            [],
            array_values(array_map(fn (NameUse $use) => "{$use->file}:{$use->line} {$use->name}", $outside)),
        );
    }
}
