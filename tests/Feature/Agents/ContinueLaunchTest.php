<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Commands\ContinueLaunch;
use App\Agents\Commands\LaunchAgent;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\LaunchOriginType;
use App\Agents\Exceptions\LaunchRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\LaunchPolicy;
use App\Agents\Support\LaunchRequest;
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
 * Continuing a launch makes one successor session that runs with the account chosen now, whoever asks how often; the
 * old session keeps its own account.
 */
final class ContinueLaunchTest extends TestCase
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
        $this->agent = Agent::named('Researcher', 'read-only-helper');
    }

    public function test_continuing_twice_gives_one_successor_on_the_account_chosen_now(): void
    {
        $first = $this->launchFirst();
        $session = AgentSession::query()->findOrFail($first);
        $oldAccount = Account::query()->withoutGlobalScopes()->where('program', 'claude-code')->sole();
        $session->endAt(CarbonImmutable::now());
        $label = AccountLabel::from('Second');
        $newAccount = Account::signedIn(HookProgram::ClaudeCode, $label, '/journal/accounts/second');
        ActiveAccount::lockedFor(HookProgram::ClaudeCode)->select($newAccount);

        $successor = $this->bus()->run(new ContinueLaunch($first, $this->agent->id));
        $again = $this->bus()->run(new ContinueLaunch($first, $this->agent->id));

        $this->assertNotSame($first, $successor->sessionId);
        $this->assertSame($successor->sessionId, $again->sessionId);
        $this->assertSame([true, false], [$successor->newSession, $again->newSession]);
        $this->assertTrue(AgentSession::query()->findOrFail($successor->sessionId)->isLinkedTo($newAccount));
        $this->assertTrue($session->isLinkedTo($oldAccount));
        $this->assertFalse($session->isLinkedTo($newAccount));
    }

    public function test_a_session_of_another_agent_cannot_be_continued(): void
    {
        $first = $this->launchFirst();
        $other = Agent::named('Other', 'read-only-helper');

        $this->expectException(LaunchRefused::class);

        $this->bus()->run(new ContinueLaunch($first, $other->id));
    }

    private function launchFirst(): string
    {
        $request = new LaunchRequest(
            TestSelections::requestId(),
            $this->agent->id,
            TestSelections::of(),
            LaunchOriginType::MainLaunch,
            null,
            null,
            ConversationModeType::New,
            null,
            LaunchPolicy::withoutProfile(TestSelections::onHost()),
        );

        return $this->bus()->run(new LaunchAgent($request))->sessionId;
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
