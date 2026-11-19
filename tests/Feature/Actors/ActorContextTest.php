<?php

declare(strict_types=1);

namespace Tests\Feature\Actors;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\ActorContextMissing;
use App\Actors\Support\ActorContext;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Support\AgentContext;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Tests\Support\ActsAsActors;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

final class ActorContextTest extends TestCase
{
    use ActsAsActors;
    use RefreshHookDatabase;

    public function test_a_request_without_an_authenticated_actor_has_none(): void
    {
        $this->expectException(ActorContextMissing::class);

        $this->app->make(ActorContext::class);
    }

    public function test_the_next_request_on_a_worker_does_not_see_the_previous_actor(): void
    {
        $this->actAs(TestActors::user(7));
        $this->assertSame(
            [ActorType::User, TestIds::of(7)],
            [$this->app->make(ActorContext::class)->type, $this->app->make(ActorContext::class)->id],
        );

        $this->app->forgetScopedInstances();

        $this->expectException(ActorContextMissing::class);
        $this->app->make(ActorContext::class);
    }

    public function test_the_reader_and_the_setter_share_one_store_until_it_is_cleared(): void
    {
        $actors = $this->app->make(CurrentActor::class);
        $this->assertFalse($actors->hasActor());

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent(TestIds::of(3)),
            TestStartAuthority::forAgent(TestIds::of(3)),
        );
        $this->assertSame([ActorType::Agent, TestIds::of(3)], [$actors->actor()->type, $actors->actor()->id]);

        $this->app->make(CurrentActorSetter::class)->clear();
        $this->assertFalse($actors->hasActor());
        $this->expectException(ActorContextMissing::class);
        $actors->actor();
    }

    public function test_a_signed_in_users_request_leaves_no_actor_behind_for_the_next(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));

        $this->actingAs($owner)->get('/plans')->assertOk();

        $this->assertFalse($this->app->make(CurrentActor::class)->hasActor());
    }

    public function test_the_context_of_a_signed_agent_call_is_that_agent_as_actor(): void
    {
        $actor = ActorContext::of(
            new AgentContext(
                TestIds::of(3),
                TestIds::of(30),
                new SignedCall('call-1', CarbonImmutable::now(), str_repeat('a', 64)),
                null,
            ),
        );

        $this->assertSame([ActorType::Agent, TestIds::of(3)], [$actor->type, $actor->id]);
    }
}
