<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sessions\SessionPolicyReader;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Starts\StartOriginType;
use App\Exceptions\SessionPolicyFrozen;
use App\Models\Agents\Agent;
use App\Models\Starts\SessionPolicy;
use App\Support\StartReceipt;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Agents\ServesEveryCombination;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsOwnerRequest;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * Every start freezes the policy it runs under with its session: written with the start, read back as it was, never changed afterwards.
 */
final class SessionPolicyTest extends TestCase
{
    use RefreshHookDatabase;
    use ServesEveryCombination;
    use StartsOwnerRequest;
    use WithActiveAccount;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
        $this->serveEveryCombination();
        $this->startUserRequestAs($this->owner->id);
    }

    public function test_a_start_freezes_its_policy_with_its_session(): void
    {
        $policy = StartPolicy::withoutProfile(TestSelections::onHost());

        $receipt = $this->startUnder($policy);

        $frozen = $this->app->make(SessionPolicyReader::class)->policyFor($receipt->sessionId);
        $this->assertSame(1, SessionPolicy::query()->where('session_id', $receipt->sessionId)->count());
        $this->assertSame($policy->digest(), $frozen->digest());
    }

    public function test_a_frozen_policy_cannot_change(): void
    {
        $receipt = $this->startUnder(StartPolicy::withoutProfile(TestSelections::onHost()));
        $row = SessionPolicy::query()->where('session_id', $receipt->sessionId)->sole();

        $this->expectException(SessionPolicyFrozen::class);

        $row->profile_key = 'writing-helper';
        $row->save();
    }

    private function startUnder(StartPolicy $policy): StartReceipt
    {
        $agent = Agent::create('Frozen policy agent', 'read-only-helper');

        return $this->app->make(CommandBus::class)->run(new StartAgentCommand(new StartRequest(
            TestSelections::requestId(),
            $agent->id,
            TestSelections::of(),
            StartOriginType::MainStart,
            null,
            null,
            ConversationModeType::New,
            null,
            $policy,
            driverType: DriverType::Headless,
        )));
    }
}
