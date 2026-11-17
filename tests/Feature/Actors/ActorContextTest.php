<?php

declare(strict_types=1);

namespace Tests\Feature\Actors;

use App\Core\Actors\ActorContext;
use App\Core\Actors\ActorKind;
use App\Core\Actors\Exceptions\ActorContextMissing;
use App\Core\Actors\Exceptions\PersonActorRequired;
use App\Core\Agents\AgentContext;
use App\Core\Agents\SignedCall;
use Carbon\CarbonImmutable;
use Tests\TestCase;

final class ActorContextTest extends TestCase
{
    public function test_a_request_without_an_authenticated_actor_has_none(): void
    {
        $this->expectException(ActorContextMissing::class);

        $this->app->make(ActorContext::class);
    }

    public function test_the_next_request_on_a_worker_does_not_see_the_previous_actor(): void
    {
        $this->app->instance(ActorContext::class, ActorContext::forPerson(7));
        $this->assertSame([ActorKind::Person, 7], [$this->app->make(ActorContext::class)->kind, $this->app->make(ActorContext::class)->id]);

        $this->app->forgetScopedInstances();

        $this->expectException(ActorContextMissing::class);
        $this->app->make(ActorContext::class);
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
