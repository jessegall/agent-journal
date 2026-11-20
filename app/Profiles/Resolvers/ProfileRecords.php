<?php

declare(strict_types=1);

namespace App\Profiles\Resolvers;

use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Exceptions\ProfileRetired;
use App\Profiles\Models\Profile;
use App\Profiles\Models\ProfileRevision;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileSnapshot;

/**
 * Reads profiles from their stored revisions: the current revision of a profile that is not retired.
 */
final readonly class ProfileRecords implements ProfileResolver
{
    public function snapshotFor(ProfileKey $key): ProfileSnapshot
    {
        return ProfileRevision::currentOf($this->admitted($key))->snapshot($key);
    }

    public function snapshotAt(ProfileKey $key, int $revision): ProfileSnapshot
    {
        return ProfileRevision::numbered(Profile::byKey($key), $revision)->snapshot($key);
    }

    public function admittedPin(ProfileKey $key, int $revision): ProfileSnapshot
    {
        return ProfileRevision::numbered($this->admitted($key), $revision)->snapshot($key);
    }

    public function has(ProfileKey $key): bool
    {
        return Profile::hasCurrent($key);
    }

    public function supervisorProfiles(): array
    {
        return ProfileRevision::currentSupervisorProfiles();
    }

    /**
     * @throws ProfileRetired
     */
    private function admitted(ProfileKey $key): Profile
    {
        $profile = Profile::byKey($key);

        return $profile->isRetired() ? throw ProfileRetired::for($key) : $profile;
    }
}
