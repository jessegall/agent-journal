<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Accounts\Enums\CommandEntry;
use App\Actors\ActorStore;
use App\Bus\JournalCommands;
use App\Models\Profiles\Profile;
use App\Models\Profiles\ProfileDraft;
use App\Profiles\Commands\ActivateProfiles\ActivateProfilesCommand;
use App\Profiles\Commands\InstallBuiltInProfiles\InstallBuiltInProfilesCommand;
use App\Profiles\Commands\SaveProfileDraft\SaveProfileDraftCommand;
use App\Profiles\ProfileProposal;
use App\Values\ProfileKey;
use App\Values\ScriptSource;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\Exceptions\FixtureRefused;

/**
 * The journal's profiles as a test needs them: the built-in ones installed only when the test asks, with the host's
 * authority, and drafts and activations through the profile commands, read back as their saved revision.
 */
trait ArrangesProfiles
{
    /**
     * Installs the built-in profiles as the host does at its start.
     */
    public function installProfiles(): self
    {
        $host = $this->app->make(JournalCommands::class)->for(CommandEntry::HostControl);
        $this->app->make(ActorStore::class)->actAsSystem(
            'test',
            fn (): mixed => $host->run(new InstallBuiltInProfilesCommand()),
        );

        return $this;
    }

    public function activatedProfile(ProfileProposal $proposal): self
    {
        $this->run(new ActivateProfilesCommand($proposal));

        return $this;
    }

    /**
     * Saves the script as the profile's next draft revision.
     */
    public function savedProfileDraft(ProfileKey $key, ScriptSource $source): self
    {
        $this->run(new SaveProfileDraftCommand($key, ProfileDraft::createForProfile($key)->revision, $source));

        return $this;
    }

    public function profileCalled(ProfileKey $key): Profile
    {
        return Profile::findByKey($key);
    }

    public function profileDraftOf(ProfileKey $key): ProfileDraft
    {
        return ProfileDraft::findOfProfile($key) ?? throw FixtureRefused::missingAlias(
            'profile draft',
            $key->key,
            self::OWNER,
        );
    }

    public function assertProfileActive(ProfileKey $key): self
    {
        Assert::assertTrue(Profile::hasCurrent($key), "The profile {$key->key} has no active revision.");

        return $this;
    }
}
