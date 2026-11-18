<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\AgentActivity;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Exceptions\AssignmentTypeUnavailable;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Access\Support\UserActivity;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Whether an actor may take work automatically now: an agent while it is not retired and one of its sessions runs,
 * a user whenever the journal admits them, and the engine never.
 */
final class AutoAssignmentActivityTest extends TestCase
{
    public function test_an_agent_takes_work_only_while_a_session_runs(): void
    {
        $agent = Agent::query()->create(['name' => 'Builder', 'role' => 'hooks.writing_helper_ready']);
        $actor = ActorIdentity::of($agent);
        $activity = $this->app->make(AssignmentProviders::class)->activity(ActorType::Agent);

        $this->assertInstanceOf(AgentActivity::class, $activity);
        $this->assertFalse($activity->mayTakeWork($actor));

        $first = $this->session($agent);

        $this->assertTrue($activity->mayTakeWork($actor));

        $first->endAt(CarbonImmutable::now());

        $this->assertFalse($activity->mayTakeWork($actor));

        $this->session($agent);

        $this->assertTrue($activity->mayTakeWork($actor));

        $agent->retireAt(CarbonImmutable::now());

        $this->assertFalse($activity->mayTakeWork($actor));
        $this->assertFalse($activity->mayTakeWork(new ActorIdentity(ActorType::Agent, TestIds::of(99))));
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
        $this->assertFalse($activity->mayTakeWork(new ActorIdentity(ActorType::User, TestIds::of(99))));
    }

    public function test_the_engine_has_no_activity(): void
    {
        $this->expectException(AssignmentTypeUnavailable::class);

        $this->app->make(AssignmentProviders::class)->activity(ActorType::Engine);
    }

    private function session(Agent $agent): AgentSession
    {
        $session = new AgentSession();
        $session->startFor($agent, null, TestSelections::of(), TestSelections::requestId());

        return $session;
    }
}
