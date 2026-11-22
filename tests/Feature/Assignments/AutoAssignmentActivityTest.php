<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Contracts\Assignments\AssignmentProviders;
use App\Enums\ActorType;
use App\Exceptions\AssignmentTypeUnavailable;
use App\Models\Agent;
use App\Models\AgentSession;
use App\Support\ActorIdentity;
use App\Support\AgentActivity;
use App\Support\AgentSessions;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Access\Support\UserActivity;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * Whether an actor may take work automatically now: an agent while it is not retired and one of its sessions runs,
 * a user whenever the journal admits them, and the engine never.
 */
final class AutoAssignmentActivityTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_an_agent_takes_work_only_while_a_session_runs(): void
    {
        $agent = Agent::create('Builder', 'writing-helper');
        $actor = ActorIdentity::of($agent);
        $activity = $this->app->make(AssignmentProviders::class)->activity(ActorType::Agent);

        $this->assertInstanceOf(AgentActivity::class, $activity);
        $this->assertFalse($activity->mayTakeWork($actor));

        $first = $this->runningSession($agent);

        $this->assertTrue($activity->mayTakeWork($actor));

        $first->endAt(CarbonImmutable::now());

        $this->assertFalse($activity->mayTakeWork($actor));

        $this->runningSession($agent);

        $this->assertTrue($activity->mayTakeWork($actor));

        $agent->retireAt(CarbonImmutable::now());

        $this->assertFalse($activity->mayTakeWork($actor));
        $this->assertFalse($activity->mayTakeWork(TestActors::agentIdentity(99)));
    }

    public function test_an_admitted_user_takes_work_without_a_session(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $activity = $this->app->make(AssignmentProviders::class)->activity(ActorType::User);

        $this->assertInstanceOf(UserActivity::class, $activity);
        $this->assertTrue($activity->mayTakeWork(ActorIdentity::of($owner)));
        $this->assertFalse($activity->mayTakeWork(ActorIdentity::of($other)));
        $this->assertFalse($activity->mayTakeWork(TestActors::userIdentity(99)));
    }

    public function test_the_engine_has_no_activity(): void
    {
        $this->expectException(AssignmentTypeUnavailable::class);

        $this->app->make(AssignmentProviders::class)->activity(ActorType::Engine);
    }

    private function runningSession(Agent $agent): AgentSession
    {
        $session = $this->app->make(AgentSessions::class)->start(
            $agent,
            TestSelections::of(),
            TestSelections::requestId(),
        );

        return $session;
    }
}
