<?php

declare(strict_types=1);

namespace Tests\Feature\Actors;

use App\Exceptions\ActiveActorCounterRepeated;
use App\Support\ActiveActorRegistration;
use Tests\Fixtures\Actors\FailingAgentCounter;
use Tests\Fixtures\Actors\FakeAgentCounter;
use Tests\TestCase;

/**
 * The present actors are counted by the counters their owners register, at one database time and in one snapshot; a
 * failing counter is a named failure, never a zero.
 */
final class ActiveActorsTest extends TestCase
{
    private ActiveActorRegistration $counters;

    protected function setUp(): void
    {
        parent::setUp();

        $this->counters = new ActiveActorRegistration();
        $this->app->instance(ActiveActorRegistration::class, $this->counters);
    }

    public function test_a_second_counter_for_one_actor_type_is_refused(): void
    {
        $this->counters->register(FakeAgentCounter::class);

        $this->expectException(ActiveActorCounterRepeated::class);
        $this->counters->register(FailingAgentCounter::class);
    }
}
