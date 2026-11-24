<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Commands\Settings\SetStringSetting\SetStringSettingCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Middleware\Web\HandleInertiaRequests;
use App\Values\SettingReference;
use Illuminate\Http\Request;
use Tests\Support\ActsAsTestOwner;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Every page names the journal by its Journal name setting, never by the framework's app name.
 */
final class JournalNameTest extends TestCase
{
    use ActsAsTestOwner;
    use RefreshHookDatabase;

    private const string JOURNAL_NAME = 'Team journal';

    public function test_every_page_shares_the_journal_name_setting(): void
    {
        $this->app->make(CommandBus::class)->run(
            new SetStringSettingCommand(new SettingReference('Core', 'display_name'), self::JOURNAL_NAME, 0),
        );
        $this->app->forgetScopedInstances();

        $shared = $this->app->make(HandleInertiaRequests::class)->share(Request::create('/'));

        $this->assertSame(self::JOURNAL_NAME, $shared['name']);
    }
}
