<?php

declare(strict_types=1);

namespace Tests\Feature\Actors;

use App\Contracts\Actors\ActorProviderRegistration;
use App\Exceptions\ActorProviderRepeated;
use App\Support\SystemActor;
use App\Support\SystemActors;
use Tests\TestCase;

/**
 * Users, agents and the system are found through one reader, each type by the provider its owner registered; a
 * missing, retired or refused actor reads the same.
 */
final class ActorResolverTest extends TestCase
{
    public function test_a_type_registers_one_provider(): void
    {
        $this->expectException(ActorProviderRepeated::class);

        $this->app->make(ActorProviderRegistration::class)->register(SystemActor::class, SystemActors::class);
    }
}
