<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Sessions\StartOriginType;
use App\Models\Agents\AgentRuntime;
use App\Models\Profiles\ProfileRevisionHold;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\SessionRequest;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use App\Support\SessionStartLimits;
use App\Support\StartHeartbeats;
use App\Values\ModelSelection;
use App\Values\SelectedDriver;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use PhpOption\None;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The engine enforces a start's limits: a start past its wall budget is stopped while a younger one runs on, and a fence
 * stops the sessions of its revision and is reconciled once none runs.
 */
#[TimeLimit(seconds: 4, reason: 'It starts test agent sessions and opens their runtimes.')]
final class EnforceSessionStartLimitsTest extends TestCase
{
    use RefreshHookDatabase;

    private int $startCount = 0;

    public function test_a_start_past_its_wall_budget_is_stopped_and_a_younger_one_runs_on(): void
    {
        $this->travel(-7)->hours();
        $old = $this->runningStart();
        $this->travelBack();
        $young = $this->runningStart();

        $this->app->make(SessionStartLimits::class)->stopOverdue();

        $this->assertFalse(AgentRuntime::isRunningForSession($old->session->id));
        $this->assertTrue(AgentRuntime::isRunningForSession($young->session->id));
    }

    public function test_a_fence_stops_the_sessions_of_its_revision_and_is_reconciled_once_none_runs(): void
    {
        $start = $this->runningStart();
        $fence = ProfileRevisionHold::create($start->session->profile_key, $start->session->profile_revision);
        $limits = $this->app->make(SessionStartLimits::class);

        $limits->enforceFences();

        $this->assertFalse(AgentRuntime::isRunningForSession($start->session->id));
        $this->assertTrue(ProfileRevisionHold::query()->whereKey($fence->id)->whereNull('reconciled_at')->exists());

        $this->app->make(StartHeartbeats::class)->markExited($start->session, 'exit 0');
        $limits->enforceFences();

        $this->assertFalse(ProfileRevisionHold::query()->whereKey($fence->id)->whereNull('reconciled_at')->exists());
    }

    /**
     * A start for an owner's work, running in its runtime with the default budgets frozen with it.
     */
    private function runningStart(): TestStart
    {
        $start = $this->journal->signedStart('Test agent '.++$this->startCount, 'writing-helper');
        $start->openRuntime($this->app);
        $start->openStack($this->app);
        $request = new StartRequest(
            $start->session->start_request_id,
            $start->agent->id,
            SelectedDriver::resolve(
                'claude-code',
                ModelSelection::named('claude-opus-5-5'),
                null,
                null,
                $this->app->make(DriverCatalogue::class),
            ),
            StartOriginType::OwnerRequest,
            new RecordIdentity('helpers.helper-job', '01m7wgahp0n7766x1e1ta8ehew'),
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Headless,
        );
        SessionRequest::create(
            $request,
            TestSelections::pinOf($request),
            ActorIdentity::system(),
            None::create(),
        )->startedAs($start->session);
        SessionPolicy::create($start->session, $request->policy);

        return $start;
    }
}
