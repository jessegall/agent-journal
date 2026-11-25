<?php

declare(strict_types=1);

namespace Tests\Feature\Actors;

use App\Contracts\Actors\ActorProviderRegistration;
use App\Contracts\Actors\ActorResolver;
use App\Exceptions\ActorProviderRepeated;
use App\Exceptions\ActorUnavailable;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\SystemActor;
use App\Support\SystemActors;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * Users, agents and the system are found through one reader, each type by the provider its owner registered; a
 * missing, retired or refused actor reads the same.
 */
final class ActorResolverTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['users', 'agents'];

    public function test_each_actor_type_is_found_by_its_own_provider(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $agent = Agent::create('Writer', 'read-only-helper');
        $resolver = $this->app->make(ActorResolver::class);

        $this->assertSame($owner->id, $resolver->get(ActorIdentity::of($owner))->actorId());
        $this->assertSame($agent->id, $resolver->get(ActorIdentity::of($agent))->actorId());
        $this->assertInstanceOf(SystemActor::class, $resolver->get(ActorIdentity::system()));
    }

    public function test_a_missing_retired_or_refused_actor_reads_the_same(): void
    {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $retired = Agent::create('Gone', 'read-only-helper');
        $retired->forceFill(['retired_at' => now()])->save();
        $resolver = $this->app->make(ActorResolver::class);

        foreach ([
            ActorIdentity::of($retired),
            ActorIdentity::of($stranger),
            ActorIdentity::ofClass(Agent::class, strtolower((string) Str::ulid())),
        ] as $identity) {
            $this->assertThrows(fn () => $resolver->get($identity), ActorUnavailable::class);
        }
    }

    public function test_a_type_registers_one_provider(): void
    {
        $this->expectException(ActorProviderRepeated::class);

        $this->app->make(ActorProviderRegistration::class)->register(SystemActor::class, SystemActors::class);
    }
}
