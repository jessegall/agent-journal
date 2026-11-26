<?php

declare(strict_types=1);

namespace Tests\Routes\Settings;

use App\Commands\Settings\DisableSettingGroup\DisableSettingGroupCommand;
use App\Commands\Settings\EnableSettingGroup\EnableSettingGroupCommand;
use App\Enums\Settings\SettingsOutcome;
use App\Values\GroupReference;
use App\Values\SettingsChange;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner switches a settings group on or off: the group is enabled or disabled at the revision the page holds.
 */
#[TestsRoute('POST', 'settings.switch')]
final class SwitchPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::recorded('settings-switch', [])
            ->reply(EnableSettingGroupCommand::class, new SettingsChange('Core', 1, SettingsOutcome::Changed))
            ->expects(EnableSettingGroupCommand::class, [
                'group' => new GroupReference('Core', 'domain_reminders'),
                'expectedRevision' => 0,
            ]);
    }

    public function test_a_group_switched_off_is_disabled(): void
    {
        $call = RouteCall::as(Caller::User)
            ->payload([
                'owner' => 'Core',
                'group' => 'domain_reminders',
                'revision' => 0,
                'enabled' => '0',
            ])
            ->reply(DisableSettingGroupCommand::class, new SettingsChange('Core', 1, SettingsOutcome::Changed))
            ->expects(DisableSettingGroupCommand::class, [
                'group' => new GroupReference('Core', 'domain_reminders'),
                'expectedRevision' => 0,
            ]);
        $this->journal->owner();

        $this->assertReachedAndDispatchesItsCommands($call);
    }
}
