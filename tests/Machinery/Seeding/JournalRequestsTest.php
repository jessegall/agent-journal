<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Actors\Contracts\CurrentActor;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\TestCase;

/**
 * The journal acts as one actor at a time, a switch to an actor it cannot find leaves the actor before in place, and
 * an agent's console commands reach the journal signed by its start.
 */
final class JournalRequestsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_an_unknown_actor_leaves_the_actor_in_place(): void
    {
        $this->journal->owner()->agent('Ada')->actAs('Ada');

        $this->assertThrows(fn () => $this->journal->actAs('Nobody'), FixtureRefused::class);

        $this->assertEquals(
            $this->journal->actorCalled('Ada'),
            $this->app->make(CurrentActor::class)->actor(),
        );
    }

    public function test_switching_from_an_agent_to_the_owner_signs_the_owner_in(): void
    {
        $this->journal->owner()->agent('Ada')->actAs('Ada')->actAs('Owner');

        $this->assertSame($this->journal->ownerUser()->id, $this->app->make('auth')->guard()->id());
        $this->assertEquals(
            $this->journal->actorCalled('Owner'),
            $this->app->make(CurrentActor::class)->actor(),
        );
    }

    public function test_an_agent_console_command_reaches_the_journal_signed_by_its_start(): void
    {
        $this->journal->owner()->agent('Ada');

        $this->journal->relayAgentCommands('Ada');
        $this->artisan('ask:list')->assertSuccessful();

        $this->journal->relayAgentCommands('Ada', 'a-token-nobody-was-issued');
        $this->artisan('ask:list')->assertFailed();
    }
}
