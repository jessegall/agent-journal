<?php

declare(strict_types=1);

namespace App\Profiles;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Drivers\Enums\DriverType;
use App\Bus\JournalCommands;
use App\Profiles\Commands\InstallBuiltInProfiles\InstallBuiltInProfilesCommand;
use App\Sessions\Contracts\BuiltInStartProfiles as BuiltInStartProfilesContract;
use App\Sessions\Contracts\ProfileResolver;
use App\Sessions\Values\StartPolicy;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use App\Values\ProfileSnapshot;
use App\Values\SelectedDriver;

/**
 * The built-in profile a start without a profile of its own is pinned to, activated with the project's proposal the
 * first time one is needed; activation is idempotent, so an unchanged definition adds no revision.
 */
final readonly class BuiltInStartProfiles implements BuiltInStartProfilesContract
{
    public function __construct(
        private ProfileResolver $profiles,
        private JournalCommands $dispatchers,
    ) {}

    public function snapshotFor(ProfileBase $type): ProfileSnapshot
    {
        return $this->snapshotOf(BuiltInProfiles::keyFor($type));
    }

    public function pin(SelectedDriver $selection, string $profileKey): SelectedDriver
    {
        if ($selection->source->profileKey !== null) {
            return $selection;
        }

        $profile = $this->snapshotOf(ProfileKey::from($profileKey));

        return $selection->pinnedTo($profile->key->key, $profile->revision);
    }

    public function defaultDriverTypeOf(string $profileKey): DriverType
    {
        return $this->snapshotOf(ProfileKey::from($profileKey))->base->defaultDriverType;
    }

    public function policyFor(string $profileKey): StartPolicy
    {
        $profile = $this->snapshotOf(ProfileKey::from($profileKey));

        return $profile->start->freeze($profile->key->key, $profile->revision);
    }

    /**
     * The profile's current revision, installing the built-in profiles first when they are not there yet.
     */
    private function snapshotOf(ProfileKey $key): ProfileSnapshot
    {
        if (! $this->profiles->has($key)) {
            $this->dispatchers->runAsJournal(
                CommandEntry::HostControl,
                'built-in profiles',
                new InstallBuiltInProfilesCommand(),
            );
        }

        return $this->profiles->snapshotFor($key);
    }
}
