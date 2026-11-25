<?php

declare(strict_types=1);

namespace Tests\Commands\Profiles;

use App\Commands\Profiles\InstallBuiltInProfiles\InstallBuiltInProfilesCommand;
use App\Enums\Accounts\CommandEntry;
use App\Models\Profiles\Profile;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The journal installs its built-in profiles, the main agent's among them; installing again adds no profile.
 */
#[TestsCommand(InstallBuiltInProfilesCommand::class)]
final class InstallBuiltInProfilesTest extends TestCase
{
    use RefreshHookDatabase;

    private const string TRUSTED_ENTRY = 'built-in profiles';

    public function test_the_built_in_profiles_are_installed_once(): void
    {
        $this->journal->owner();
        Profile::query()->delete();

        $this->journal->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, new InstallBuiltInProfilesCommand());
        $installed = Profile::query()->count();
        $this->journal->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, new InstallBuiltInProfilesCommand());

        $this->assertTrue(Profile::query()->where('key', 'main-agent')->exists());
        $this->assertSame($installed, Profile::query()->count());
    }
}
