<?php

declare(strict_types=1);

namespace Tests\Unit\Actors;

use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Exceptions\ActorProviderRepeated;
use App\Actors\SystemActor;
use App\Actors\SystemActors;
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
