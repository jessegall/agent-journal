<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Bus\Exceptions\InvalidListener;
use App\Bus\ListenerOwnership;
use App\Reflection\CatalogueReflectorFactory;
use App\Stacks\Declarations\StateMethods;
use App\Stacks\StateCatalog\StateRegistration;
use App\Stacks\StateListenerDeclarations;
use App\Stacks\StateLoading\RegisteredStateType;
use App\Support\DomainRegistry;
use Domain\Plans\PlansDomain;
use Tests\Fixtures\Hooks\Declarations\OwnerlessState;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * The declarations read at boot refuse a state event listener that no domain and not Core owns, naming it, as they
 * refuse a wrong name, parameter, return or marker (StateMethodsTest).
 */
final class StateListenerOwnerTest extends TestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class);
    }

    public function test_a_state_listener_outside_every_domain_is_refused_naming_it(): void
    {
        $types = new StateRegistration();
        $types->register(RegisteredStateType::named('fixture.ownerless', OwnerlessState::class));
        $ownership = new ListenerOwnership($this->app->make(DomainRegistry::class), [], new CatalogueReflectorFactory(), app_path());

        $this->expectException(InvalidListener::class);
        $this->expectExceptionMessage(OwnerlessState::class.'@onPlanProgressChanged');

        new StateListenerDeclarations($ownership, new CatalogueReflectorFactory())->declarations($types, new StateMethods());
    }
}
