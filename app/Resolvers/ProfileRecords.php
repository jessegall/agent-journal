<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Scripts\ProfileScripts;
use App\Contracts\Sessions\ProfileResolver;
use App\Exceptions\ProfileRetired;
use App\Models\Profiles\Profile;
use App\Models\Profiles\ProfileRevision;
use App\Values\ProfileKey;
use App\Values\ProfileSnapshot;
use PhpOption\Option;

/**
 * Reads profiles from their stored revisions: the current revision of a profile that is not retired.
 */
final readonly class ProfileRecords implements ProfileResolver, ProfileScripts
{
    public function snapshotFor(ProfileKey $key): ProfileSnapshot
    {
        return ProfileRevision::currentOf($this->admitted($key))->snapshot($key);
    }

    public function snapshotAt(ProfileKey $key, int $revision): ProfileSnapshot
    {
        return ProfileRevision::numbered(Profile::byKey($key), $revision)->snapshot($key);
    }

    public function scriptAt(ProfileKey $key, int $revision): Option
    {
        return ProfileRevision::numbered(Profile::byKey($key), $revision)->script;
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
