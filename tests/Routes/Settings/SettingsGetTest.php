<?php

declare(strict_types=1);

namespace Tests\Routes\Settings;

use App\Http\Pages\SettingsPageBuilder;
use App\Http\Pages\SettingsPageData;
use App\Web\Creation\PageFactory;
use Illuminate\Http\Request;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the settings page.
 */
#[TestsRoute('GET', 'settings.settings')]
final class SettingsGetTest extends GuardedRouteEntryTestCase
{
    public function test_settings_builds_the_checked_layout_for_its_own_visit(): void
    {
        $this->journal->owner();
        $factory = new PageFactory($this->app);
        $factory->register(SettingsPageData::class, SettingsPageBuilder::class);

        $settings = $factory->create(SettingsPageData::class, Request::create('/settings'));

        $this->assertSame('settings', $settings->layout()->root->key);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User);
    }
}
