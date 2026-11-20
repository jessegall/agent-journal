<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Commands\ContinueStart;
use App\Agents\Commands\StartAgent;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\StartOriginType;
use App\Agents\Exceptions\StartRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StartPolicy;
use App\Agents\Support\StartRequest;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Values\AccountLabel;
use App\Programs\Enums\HookProgram;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * Continuing a start makes one successor session that runs with the account chosen now, whoever asks how often; the
 * old session keeps its own account.
 */
final class ContinueStartTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;
    use WithActiveAccount;

    private Agent $agent;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->startUserRequestAs($this->owner->id);
        $this->agent = Agent::create('Researcher', 'read-only-helper');
    }

    public function test_continuing_twice_gives_one_successor_on_the_account_chosen_now(): void
    {
        $first = $this->startFirst();
        $session = AgentSession::query()->findOrFail($first);
        $oldAccount = Account::query()->withoutGlobalScopes()->where('program', 'claude-code')->sole();
        $session->endAt(CarbonImmutable::now());
        $label = AccountLabel::from('Second');
        $newAccount = Account::create(HookProgram::ClaudeCode, $label, '/journal/accounts/second');
        ActiveAccount::lockedFor(HookProgram::ClaudeCode)->select($newAccount);

        $successor = $this->bus()->run(new ContinueStart($first, $this->agent->id));
        $again = $this->bus()->run(new ContinueStart($first, $this->agent->id));

        $this->assertNotSame($first, $successor->sessionId);
        $this->assertSame($successor->sessionId, $again->sessionId);
        $this->assertSame([true, false], [$successor->newSession, $again->newSession]);
        $this->assertTrue(AgentSession::query()->findOrFail($successor->sessionId)->isLinkedTo($newAccount));
        $this->assertTrue($session->isLinkedTo($oldAccount));
        $this->assertFalse($session->isLinkedTo($newAccount));
    }

    public function test_a_session_of_another_agent_cannot_be_continued(): void
    {
        $first = $this->startFirst();
        $other = Agent::create('Other', 'read-only-helper');

        $this->expectException(StartRefused::class);

        $this->bus()->run(new ContinueStart($first, $other->id));
    }

    private function startFirst(): string
    {
        $request = new StartRequest(
            TestSelections::requestId(),
            $this->agent->id,
            TestSelections::of(),
            StartOriginType::MainStart,
            null,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
        );

        return $this->bus()->run(new StartAgent($request))->sessionId;
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
