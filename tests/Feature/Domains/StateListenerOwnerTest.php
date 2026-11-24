<?php

declare(strict_types=1);

namespace Tests\Feature\Domains;

use App\CoreApi;
use App\Declarations\StateMethods;
use App\Exceptions\InvalidListener;
use App\Support\CatalogueReflectorFactory;
use App\Support\DomainRegistry;
use App\Support\ListenerOwnership;
use App\Support\StateCatalog\StateTypeRegistry;
use App\Support\StateListenerDeclarations;
use App\Support\StateLoading\RegisteredStateType;
use Tests\Fixtures\Hooks\Declarations\OwnerlessState;
use Tests\TestCase;

/**
 * The declarations read at boot refuse a state event listener that no domain and not Core owns, naming it, as they
 * refuse a wrong name, parameter, return or marker (StateMethodsTest).
 */
final class StateListenerOwnerTest extends TestCase
{
    public function test_a_state_listener_outside_every_domain_is_refused_naming_it(): void
    {
        $types = new StateTypeRegistry();
        $types->register(RegisteredStateType::named('fixture.ownerless', OwnerlessState::class));
        $ownership = new ListenerOwnership($this->app->make(DomainRegistry::class), CoreApi::exports(), [], new CatalogueReflectorFactory(), app_path());

        $this->expectException(InvalidListener::class);
        $this->expectExceptionMessage(OwnerlessState::class.'@onPlanProgressChanged');

        new StateListenerDeclarations($ownership, new CatalogueReflectorFactory())->declarations($types, new StateMethods());
    }
}
