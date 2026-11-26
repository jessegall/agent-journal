<?php

declare(strict_types=1);

namespace Tests\Routes\Settings;

use App\Settings\Commands\ResetSetting\ResetSettingCommand;
use App\Settings\Commands\SetBooleanSetting\SetBooleanSettingCommand;
use App\Settings\Enums\SettingsOutcome;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner resets the connected projects group: the setting changed from its default is reset.
 */
#[TestsRoute('POST', 'settings.reset')]
final class ResetPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->run(new SetBooleanSettingCommand(new SettingReference('Core', 'remote_projects'), true, 0));

        return RouteCall::recorded('settings-reset', [])
            ->reply(ResetSettingCommand::class, new SettingsChange('Core', 2, SettingsOutcome::Changed))
            ->expects(ResetSettingCommand::class, [
                'setting' => new SettingReference('Core', 'remote_projects'),
                'expectedRevision' => 0,
            ]);
    }
}
