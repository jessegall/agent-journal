<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Agents\ContinueStart\ContinueStartCommand;
use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\ConversationModeType;
use App\Enums\DriverType;
use App\Enums\StartOriginType;
use App\Exceptions\StartRefused;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Starts\StartRecord;
use App\Support\DefaultDrivers;
use App\Values\AccountLabel;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Agents\ServesEveryCombination;
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
    use ServesEveryCombination;
    use StartsAgentRequests;
    use WithActiveAccount;

    private Agent $agent;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
        $this->serveEveryCombination();
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->startUserRequestAs($this->owner->id);
        $this->agent = Agent::create('Researcher', 'read-only-helper');
    }

    public function test_continuing_twice_gives_one_successor_on_the_account_chosen_now(): void
    {
        $first = $this->startFirst();
        $session = AgentSession::query()->findOrFail($first);
        $oldAccount = Account::query()->withoutGlobalScopes()->where('account_protocol', 'claude-code')->sole();
        $session->endAt(CarbonImmutable::now());
        $label = AccountLabel::from('Second');
        $newAccount = Account::create(DefaultDrivers::CLAUDE_CODE, $label, '/journal/accounts/second');
        ActiveAccount::lockedFor(DefaultDrivers::CLAUDE_CODE)->select($newAccount);

        $successor = $this->bus()->run(new ContinueStartCommand($first, $this->agent->id));
        $again = $this->bus()->run(new ContinueStartCommand($first, $this->agent->id));

        $this->assertNotSame($first, $successor->sessionId);
        $this->assertSame($successor->sessionId, $again->sessionId);
        $this->assertSame([true, false], [$successor->isNewSession, $again->isNewSession]);
        $this->assertTrue(AgentSession::query()->findOrFail($successor->sessionId)->isLinkedTo($newAccount));
        $this->assertTrue($session->isLinkedTo($oldAccount));
        $this->assertFalse($session->isLinkedTo($newAccount));
    }

    public function test_a_continued_terminal_session_goes_on_in_a_terminal(): void
    {
        $first = $this->startFirst(DriverType::Terminal);
        AgentSession::query()->findOrFail($first)->endAt(CarbonImmutable::now());

        $successor = $this->bus()->run(new ContinueStartCommand($first, $this->agent->id));

        $this->assertSame(
            DriverType::Terminal,
            StartRecord::query()->where('request_id', $successor->requestId)->sole()->driver_type,
        );
    }

    public function test_a_session_of_another_agent_cannot_be_continued(): void
    {
        $first = $this->startFirst();
        $other = Agent::create('Other', 'read-only-helper');

        $this->expectException(StartRefused::class);

        $this->bus()->run(new ContinueStartCommand($first, $other->id));
    }

    private function startFirst(DriverType $driverType = DriverType::Headless): string
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
            driverType: $driverType,
        );

        return $this->bus()->run(new StartAgentCommand($request))->sessionId;
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
