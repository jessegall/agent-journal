<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Agents\Commands\ChooseNextStart\ChooseNextStartCommand;
use App\Agents\Commands\SwitchAgentDriver\SwitchAgentDriverCommand;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverSwitchStage;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Values\DriverSwitchReceipt;
use App\Values\ChosenAccount;
use App\Values\DriverSwitchTarget;
use App\Values\ModelSelection;
use App\Values\ProfileKey;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner moves a running agent to another driver and account, at the session and generation the page showed.
 */
#[TestsRoute('POST', 'profiles.switch')]
final class SwitchPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Main');
        $requestId = strtolower((string) Str::ulid());
        $accountId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->parameters(['profile' => 'main-agent'])
            ->payload([
                'requestId' => $requestId,
                'agentId' => $start->agent->id,
                'expectedSessionId' => $start->session->id,
                'expectedGeneration' => 0,
                'driver' => DefaultDrivers::CODEX,
                'driverType' => 'headless',
                'accountId' => $accountId,
                'accountRevision' => 0,
                'model' => 'gpt-5',
                'carryConversation' => true,
                'stopsTurn' => true,
            ])
            ->reply(SwitchAgentDriverCommand::class, new DriverSwitchReceipt(
                strtolower((string) Str::ulid()),
                DriverSwitchStage::Requested,
                null,
            ))
            ->expects(SwitchAgentDriverCommand::class, [
                'requestId' => $requestId,
                'agentId' => $start->agent->id,
                'profile' => ProfileKey::from('main-agent'),
                'expectedSessionId' => $start->session->id,
                'expectedGeneration' => 0,
                'target' => new DriverSwitchTarget(
                    DefaultDrivers::CODEX,
                    DriverType::Headless,
                    new ChosenAccount($accountId, 0),
                    null,
                    false,
                    'gpt-5',
                    true,
                ),
                'requested' => ModelSelection::named('gpt-5'),
                'stopsTurn' => true,
            ]);
    }

    public function test_a_switch_of_an_agent_with_no_session_keeps_the_choice_for_its_next_message(): void
    {
        $agent = $this->journal->owner()->idleAgent('Main', 'main-agent')->agentCalled('Main');
        $accountId = strtolower((string) Str::ulid());
        $this->journal->sinkCommands();

        $this->journal->route('POST', 'profiles.switch', ['profile' => 'main-agent'], payload: [
            'requestId' => strtolower((string) Str::ulid()),
            'agentId' => $agent->id,
            'driver' => DefaultDrivers::CODEX,
            'driverType' => 'headless',
            'accountId' => $accountId,
            'accountRevision' => 3,
            'model' => 'gpt-5',
        ])->assertRedirect();

        $this->journal->assertDispatched(SwitchAgentDriverCommand::class, times: 0)
            ->assertDispatched(ChooseNextStartCommand::class, [
                'agentId' => $agent->id,
                'driver' => DefaultDrivers::CODEX,
                'model' => 'gpt-5',
                'account' => new ChosenAccount($accountId, 3),
            ]);
    }
}
