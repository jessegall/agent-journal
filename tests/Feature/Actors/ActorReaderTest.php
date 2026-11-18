<?php

declare(strict_types=1);

namespace Tests\Feature\Actors;

use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Contracts\ActorReader;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\ActorProviderRepeated;
use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\SystemActor;
use App\Actors\Support\SystemActors;
use App\Agents\Models\Agent;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * Users, agents and the system are found through one reader, each type by the provider its owner registered; a
 * missing, retired or refused actor reads the same.
 */
final class ActorReaderTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['users', 'agents'];

    public function test_each_actor_type_is_found_by_its_own_provider(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $agent = Agent::query()->create(['name' => 'Writer', 'role' => 'hooks.read_only_helper_ready']);
        $reader = $this->app->make(ActorReader::class);

        $this->assertSame($owner->id, $reader->get(ActorIdentity::of($owner))->actorId());
        $this->assertSame($agent->id, $reader->get(ActorIdentity::of($agent))->actorId());
        $this->assertInstanceOf(SystemActor::class, $reader->get(ActorIdentity::system()));
    }

    public function test_a_missing_retired_or_refused_actor_reads_the_same(): void
    {
        $owner = User::factory()->create();
        $stranger = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $retired = Agent::query()->create(['name' => 'Gone', 'role' => 'hooks.read_only_helper_ready']);
        $retired->forceFill(['retired_at' => now()])->save();
        $reader = $this->app->make(ActorReader::class);

        foreach ([ActorIdentity::of($retired), ActorIdentity::of($stranger), new ActorIdentity(ActorType::Agent, strtolower((string) Str::ulid()))] as $identity) {
            $this->assertThrows(fn () => $reader->get($identity), ActorUnavailable::class);
        }
    }

    public function test_a_type_registers_one_provider(): void
    {
        $this->expectException(ActorProviderRepeated::class);

        $this->app->make(ActorProviderRegistration::class)->register(ActorType::System, SystemActors::class);
    }
}
