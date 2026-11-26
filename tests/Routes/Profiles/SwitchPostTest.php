<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Commands\Agents\SwitchAgentDriver\SwitchAgentDriverCommand;
use App\Enums\Drivers\DriverSwitchStage;
use App\Enums\Drivers\DriverType;
use App\Support\DefaultDrivers;
use App\Values\ChosenAccount;
use App\Values\DriverSwitchReceipt;
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
            ->parameters([
                'profile' => 'main-agent',
            ])
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
                ),
                'requested' => ModelSelection::named('gpt-5'),
            ]);
    }
}
