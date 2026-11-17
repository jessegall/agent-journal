<?php

declare(strict_types=1);

namespace Tests\Feature\Actors;

use App\Core\Actors\ActorContext;
use App\Core\Actors\ActorKind;
use App\Core\Actors\CurrentActor;
use App\Core\Actors\EstablishActor;
use App\Core\Actors\Exceptions\ActorContextMissing;
use App\Core\Actors\Exceptions\PersonActorRequired;
use App\Core\Agents\AgentContext;
use App\Core\Agents\SignedCall;
use App\Domain\Access\AccessSettings;
use App\Domain\Access\Models\User;
use Carbon\CarbonImmutable;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

final class ActorContextTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_request_without_an_authenticated_actor_has_none(): void
    {
        $this->expectException(ActorContextMissing::class);

        $this->app->make(ActorContext::class);
    }

    public function test_the_next_request_on_a_worker_does_not_see_the_previous_actor(): void
    {
        $this->app->make(EstablishActor::class)->establish(ActorContext::forPerson(7));
        $this->assertSame([ActorKind::Person, 7], [$this->app->make(ActorContext::class)->kind, $this->app->make(ActorContext::class)->id]);

        $this->app->forgetScopedInstances();

        $this->expectException(ActorContextMissing::class);
        $this->app->make(ActorContext::class);
    }

    public function test_the_reader_and_the_setter_share_one_store_until_it_is_cleared(): void
    {
        $actors = $this->app->make(CurrentActor::class);
        $this->assertFalse($actors->hasActor());

        $this->app->make(EstablishActor::class)->establish(ActorContext::forAgent(3));
        $this->assertSame([ActorKind::Agent, 3], [$actors->actor()->kind, $actors->actor()->id]);

        $this->app->make(EstablishActor::class)->clear();
        $this->assertFalse($actors->hasActor());
        $this->expectException(ActorContextMissing::class);
        $actors->actor();
    }

    public function test_a_signed_in_persons_request_leaves_no_actor_behind_for_the_next(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));

        $this->actingAs($owner)->get('/plans')->assertOk();

        $this->assertFalse($this->app->make(CurrentActor::class)->hasActor());
    }

    public function test_the_context_of_a_signed_agent_call_is_that_agent_as_actor(): void
    {
        $actor = ActorContext::of(new AgentContext(3, 30, 'hooks.main_ready', new SignedCall('call-1', CarbonImmutable::now(), str_repeat('a', 64))));

        $this->assertSame([ActorKind::Agent, 3], [$actor->kind, $actor->id]);
    }

    public function test_an_agent_is_not_a_person(): void
    {
        $this->expectException(PersonActorRequired::class);

        ActorContext::forAgent(3)->requirePerson();
    }
}
