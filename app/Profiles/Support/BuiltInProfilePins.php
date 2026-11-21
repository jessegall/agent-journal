<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Agents\Contracts\BuiltInStartProfiles;
use App\Agents\Enums\DriverVariant;
use App\Agents\Values\SelectedDriver;
use App\Agents\Values\StartPolicy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Profiles\Commands\InstallBuiltInProfiles;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileSnapshot;

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

    public function defaultVariantOf(string $profileKey): DriverVariant
    {
        return $this->snapshotOf(ProfileKey::from($profileKey))->base->defaultVariant;
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
                new InstallBuiltInProfiles(),
            );
        }

        return $this->profiles->snapshotFor($key);
    }
}
