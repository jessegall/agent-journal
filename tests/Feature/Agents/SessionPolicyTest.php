<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Commands\LaunchAgent;
use App\Agents\Contracts\SessionPolicyReader;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\LaunchOriginType;
use App\Agents\Exceptions\SessionPolicyFrozen;
use App\Agents\Models\Agent;
use App\Agents\Models\SessionPolicy;
use App\Agents\Support\LaunchPolicy;
use App\Agents\Support\LaunchReceipt;
use App\Agents\Support\LaunchRequest;
use App\Bus\Contracts\CommandBus;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * Every launch freezes the policy it runs under with its session (doc 14 revision 5, section 49; plan 10 decision
 * P11): written with the launch, read back as it was, never changed afterwards.
 */
final class SessionPolicyTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
    }

    public function test_a_launch_freezes_its_policy_with_its_session(): void
    {
        $policy = LaunchPolicy::withoutProfile(TestSelections::onHost());

        $receipt = $this->launchUnder($policy);

        $frozen = $this->app->make(SessionPolicyReader::class)->policyFor($receipt->sessionId);
        $this->assertSame(1, SessionPolicy::query()->where('session_id', $receipt->sessionId)->count());
        $this->assertSame($policy->digest(), $frozen->digest());
    }

    public function test_a_frozen_policy_cannot_change(): void
    {
        $receipt = $this->launchUnder(LaunchPolicy::withoutProfile(TestSelections::onHost()));
        $row = SessionPolicy::query()->where('session_id', $receipt->sessionId)->sole();

        $this->expectException(SessionPolicyFrozen::class);

        $row->profile_key = 'writing-helper';
        $row->save();
    }

    private function launchUnder(LaunchPolicy $policy): LaunchReceipt
    {
        $agent = Agent::named('Frozen policy agent', 'read-only-helper');

        return $this->app->make(CommandBus::class)->run(new LaunchAgent(new LaunchRequest(
            TestSelections::requestId(),
            $agent->id,
            TestSelections::of(),
            LaunchOriginType::MainLaunch,
            null,
            null,
            ConversationModeType::New,
            null,
            $policy,
        )));
    }
}
