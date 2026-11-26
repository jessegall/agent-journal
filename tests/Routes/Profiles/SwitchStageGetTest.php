<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

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
 * The owner's page reads how far a driver switch it asked for has got: nothing is sent on.
 */
#[TestsRoute('GET', 'profiles.switch-stage')]
final class SwitchStageGetTest extends GuardedRouteEntryTestCase
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

        return RouteCall::as(Caller::User)->parameters([
            'requestId' => $switch->request_id,
        ]);
    }
}
