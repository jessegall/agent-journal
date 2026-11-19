<?php

declare(strict_types=1);

namespace App\Profiles\Contracts;

use App\Profiles\Exceptions\ProfileMissing;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileSnapshot;

/**
 * Reads the current revision of a profile by its stable key.
 */
interface ProfileResolver
{
    /**
     * @throws ProfileMissing when no current profile has this key
     */
    public function snapshotFor(ProfileKey $key): ProfileSnapshot;

    /**
     * The profile's revision with this number, retired or not, as a launch recorded it.
     *
     * @throws ProfileMissing when no profile has this key
     */
    public function snapshotAt(ProfileKey $key, int $revision): ProfileSnapshot;

    public function has(ProfileKey $key): bool;
}
