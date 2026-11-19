<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Commands\StartAgent;
use App\Agents\Contracts\SessionPolicyReader;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\StartOriginType;
use App\Agents\Exceptions\SessionPolicyFrozen;
use App\Agents\Models\Agent;
use App\Agents\Models\SessionPolicy;
use App\Agents\Support\StartPolicy;
use App\Agents\Support\StartReceipt;
use App\Agents\Support\StartRequest;
use App\Bus\Contracts\CommandBus;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsOwnerRequest;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * Every start freezes the policy it runs under with its session (doc 14 revision 5, section 49; plan 10 decision
 * P11): written with the start, read back as it was, never changed afterwards.
 */
final class SessionPolicyTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsOwnerRequest;
    use WithActiveAccount;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
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
        $agent = Agent::named('Frozen policy agent', 'read-only-helper');

        return $this->app->make(CommandBus::class)->run(new StartAgent(new StartRequest(
            TestSelections::requestId(),
            $agent->id,
            TestSelections::of(),
            StartOriginType::MainStart,
            null,
            null,
            ConversationModeType::New,
            null,
            $policy,
        )));
    }
}
