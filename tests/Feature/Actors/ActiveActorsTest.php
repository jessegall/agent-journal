<?php

declare(strict_types=1);

namespace Tests\Feature\Actors;

use App\Exceptions\ActiveActorCounterRepeated;
use App\Exceptions\ActiveActorsUnavailable;
use App\Support\ActiveActorRegistration;
use App\Support\ActiveActorsResolver;
use Tests\Fixtures\Actors\FailingAgentCounter;
use Tests\Fixtures\Actors\FakeAgentCounter;
use Tests\Fixtures\Actors\FakeUserCounter;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * The present actors are counted by the counters their owners register, at one database time and in one snapshot; a
 * failing counter is a named failure, never a zero.
 */
final class ActiveActorsTest extends TestCase
{
    use CommitsHookRows;

    private const string TABLE_GONE = 'The session table is gone.';

    private const array TABLES = [];

    private ActiveActorRegistration $counters;

    protected function setUp(): void
    {
        parent::setUp();

        $this->counters = new ActiveActorRegistration();
        $this->app->instance(ActiveActorRegistration::class, $this->counters);
    }

    public function test_the_snapshot_adds_every_counter_at_one_observation_time(): void
    {
        $agents = new FakeAgentCounter();
        $users = new FakeUserCounter();
        $this->app->instance(FakeAgentCounter::class, $agents);
        $this->app->instance(FakeUserCounter::class, $users);
        $this->counters->register(FakeAgentCounter::class);
        $this->counters->register(FakeUserCounter::class);

        $snapshot = $this->app->make(ActiveActorsResolver::class)->snapshot();

        $this->assertSame(2, $snapshot->agentSessions);
        $this->assertSame(1, $snapshot->users);
        $this->assertSame(3, $snapshot->total());
        $this->assertEquals([$snapshot->observedAt], $agents->observedAt);
        $this->assertEquals([$snapshot->observedAt], $users->observedAt);
    }

    public function test_a_type_without_a_counter_counts_zero(): void
    {
        $this->counters->register(FakeUserCounter::class);

        $snapshot = $this->app->make(ActiveActorsResolver::class)->snapshot();

        $this->assertSame(0, $snapshot->agentSessions);
        $this->assertSame(1, $snapshot->total());
    }

    public function test_a_failing_counter_makes_the_snapshot_unavailable_with_its_cause(): void
    {
        $this->counters->register(FailingAgentCounter::class);
        $this->counters->register(FakeUserCounter::class);

        try {
            $this->app->make(ActiveActorsResolver::class)->snapshot();
            $this->fail('The snapshot did not fail.');
        } catch (ActiveActorsUnavailable $unavailable) {
            $this->assertSame(self::TABLE_GONE, $unavailable->getPrevious()?->getMessage());
        }
    }

    public function test_a_second_counter_for_one_actor_type_is_refused(): void
    {
        $this->counters->register(FakeAgentCounter::class);

        $this->expectException(ActiveActorCounterRepeated::class);
        $this->counters->register(FailingAgentCounter::class);
    }
}
