<?php

declare(strict_types=1);

namespace Tests\Feature\Domains;

use App\CoreApi;
use App\Domains\Exceptions\InvalidListener;
use App\Domains\Support\DomainRegistry;
use App\Domains\Support\ListenerOwnership;
use App\Domains\Support\StateListenerDeclarations;
use App\Hooks\Declarations\StateMethods;
use App\Hooks\StateCatalog\StateTypeRegistry;
use Tests\Fixtures\Hooks\Declarations\OwnerlessLoader;
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
        $types->register('fixture.ownerless', new OwnerlessLoader());
        $ownership = new ListenerOwnership($this->app->make(DomainRegistry::class), CoreApi::exports(), []);

        $this->expectException(InvalidListener::class);
        $this->expectExceptionMessage(OwnerlessState::class.'@onPlanProgressChanged');

        new StateListenerDeclarations($ownership)->declarations($types, new StateMethods());
    }
}
