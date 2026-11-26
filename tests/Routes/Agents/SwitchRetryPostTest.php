<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Drivers\RetryDriverSwitch\RetryDriverSwitchCommand;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\Drivers\DriverType;
use App\Models\Drivers\DriverSwitch;
use App\Support\DefaultDrivers;
use App\Values\ChosenAccount;
use App\Values\DriverSwitchTarget;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner retries a driver switch that failed.
 */
#[TestsRoute('POST', 'agents.switch.retry')]
final class SwitchRetryPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Main');
        $switch = DriverSwitch::create(
            strtolower((string) Str::ulid()),
            $start->session,
            0,
            new DriverSwitchTarget(
                DefaultDrivers::CODEX,
                DriverType::Headless,
                new ChosenAccount(strtolower((string) Str::ulid()), 0),
                null,
                false,
            ),
            $this->app->make(DriverCatalogue::class)->pinned(DefaultDrivers::CODEX, DriverType::Headless),
            'owner',
        );

        return RouteCall::as(Caller::User)
            ->parameters([
                'switch' => $switch->id,
            ])
            ->expects(RetryDriverSwitchCommand::class, [
                'switchId' => $switch->id,
            ]);
    }
}
