<?php

declare(strict_types=1);

namespace Tests\Routes\Settings;

use App\Settings\Commands\SetBooleanSetting\SetBooleanSettingCommand;
use App\Settings\Enums\SettingsOutcome;
use App\Settings\Values\SettingReference;
use App\Settings\Values\SettingsChange;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner saves the connected projects group: the one setting that changed is set, at the revision the page holds;
 * a save that changes nothing sends nothing.
 */
#[TestsRoute('POST', 'settings.save')]
final class SavePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::recorded('settings-save', [])
            ->reply(SetBooleanSettingCommand::class, new SettingsChange('Core', 1, SettingsOutcome::Changed))
            ->expects(SetBooleanSettingCommand::class, [
                'setting' => new SettingReference('Core', 'remote_projects'),
                'isEnabled' => true,
                'expectedRevision' => 0,
            ]);
    }

    public function test_a_save_that_changes_nothing_sends_nothing(): void
    {
        $call = RouteCall::as(Caller::User)->payload([
            'owner' => 'Core',
            'group' => 'connected_projects',
            'revision' => 0,
            'remote_projects' => '0',
        ]);
        $this->journal->owner();

        $this->assertReachedAndDispatchesItsCommands($call);
    }
}
