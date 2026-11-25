<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\Profiles\InstallBuiltInProfiles\InstallBuiltInProfilesCommand;
use App\Contracts\Sessions\BuiltInStartProfiles;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Drivers\DriverType;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use App\Values\ProfileSnapshot;
use App\Values\SelectedDriver;
use App\Values\StartPolicy;

/**
 * The built-in profile a start without a profile of its own is pinned to, activated with the project's proposal the
 * first time one is needed; activation is idempotent, so an unchanged definition adds no revision.
 */
final readonly class BuiltInProfilePins implements BuiltInStartProfiles
{
    public function __construct(
        private ProfileResolver $profiles,
        private EntryDispatchers $dispatchers,
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
