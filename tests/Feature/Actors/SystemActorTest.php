<?php

declare(strict_types=1);

namespace Tests\Feature\Actors;

use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\InvalidActorText;
use App\Actors\Exceptions\SystemActorRequired;
use App\Actors\Exceptions\UserActorRequired;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\ActorStore;
use App\Actors\Support\SystemActor;
use App\Actors\Values\OwnerAuthority;
use Domain\Access\Models\User;
use RuntimeException;
use Tests\TestCase;

/**
 * The journal itself is an actor that only sends, that text from outside can never name, and that only trusted Core
 * code acts as, for exactly the work it runs.
 */
final class SystemActorTest extends TestCase
{
    public function test_text_from_outside_never_names_the_system(): void
    {
        $this->assertTrue(ActorIdentity::system()->isSameAs(ActorIdentity::of(new SystemActor())));
        $this->expectException(InvalidActorText::class);

        ActorIdentity::fromText('system:1');
    }

    public function test_acting_as_the_system_lasts_only_for_its_work_even_when_it_throws(): void
    {
        $store = $this->app->make(ActorStore::class);
        $store->set(new User()->forceFill(['id' => '01jd8x0g9m3qz6v4k2t7r5w1ce']), new OwnerAuthority('test'));

        $inside = $store->actAsSystem('test', fn () => $store->actor()->actorType());

        try {
            $store->actAsSystem('test', fn () => throw new RuntimeException('failed'));
        } catch (RuntimeException) {
        }

        $this->assertSame(ActorType::System, $inside);
        $this->assertSame(ActorType::User, $store->actor()->actorType());
    }

    public function test_each_required_actor_type_has_its_own_refusal(): void
    {
        $this->assertInstanceOf(SystemActorRequired::class, ActorType::System->refusalFor(ActorType::User));
        $this->assertInstanceOf(UserActorRequired::class, ActorType::User->refusalFor(ActorType::System));
    }
}
