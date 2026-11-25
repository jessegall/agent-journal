<?php

declare(strict_types=1);

namespace Tests\Commands\Inboxes;

use App\Commands\Inboxes\InstallInboxes\InstallInboxesCommand;
use App\Enums\Accounts\CommandEntry;
use App\Models\Inboxes\Inbox;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\SeedsJournal;
use Tests\TestCase;

/**
 * The journal installs its named inboxes, the main inbox among them; installing again adds none.
 */
final class InstallInboxesTest extends TestCase
{
    use RefreshHookDatabase;
    use SeedsJournal;

    private const string TRUSTED_ENTRY = 'inbox install';

    public function test_the_named_inboxes_are_installed_once(): void
    {
        $this->journal()->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, new InstallInboxesCommand());
        $installed = Inbox::query()->withoutGlobalScopes()->where('provider_key', Inbox::NAMED_PROVIDER)->count();
        $this->journal()->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, new InstallInboxesCommand());

        $this->assertTrue(Inbox::findNamed(Inbox::MAIN)->isDefined());
        $this->assertSame($installed, Inbox::query()->withoutGlobalScopes()->where('provider_key', Inbox::NAMED_PROVIDER)->count());
    }
}
