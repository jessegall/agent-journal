<?php

declare(strict_types=1);

namespace App\Profiles\Readers;

use App\Profiles\Contracts\ProfileReader;
use App\Profiles\Exceptions\ProfileRetired;
use App\Profiles\Models\Profile;
use App\Profiles\Models\ProfileRevision;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileSnapshot;

/**
 * Reads profiles from their stored revisions: the current revision of a profile that is not retired.
 */
final readonly class ProfileRecords implements ProfileReader
{
    public function snapshotFor(ProfileKey $key): ProfileSnapshot
    {
        $profile = Profile::byKey($key);

        if ($profile->isRetired()) {
            throw ProfileRetired::for($key);
        }

        return ProfileRevision::currentOf($profile)->snapshot($key);
    }

    public function snapshotAt(ProfileKey $key, int $revision): ProfileSnapshot
    {
        return ProfileRevision::numbered(Profile::byKey($key), $revision)->snapshot($key);
    }

    public function has(ProfileKey $key): bool
    {
        return Profile::hasCurrent($key);
    }
}
