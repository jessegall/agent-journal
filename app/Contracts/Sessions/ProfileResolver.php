<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

use App\Exceptions\ProfileMissing;
use App\Exceptions\ProfileRetired;
use App\Values\ProfileKey;
use App\Values\ProfileSnapshot;
use App\Values\SupervisorProfile;

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
     * The profile's revision with this number, retired or not, as a start recorded it.
     *
     * @throws ProfileMissing when no profile has this key
     */
    public function snapshotAt(ProfileKey $key, int $revision): ProfileSnapshot;

    public function has(ProfileKey $key): bool;

    /**
     * @return list<SupervisorProfile>
     */
    public function supervisorProfiles(): array;

    /**
     * A start's pinned revision, refused when the profile is no longer admitted; a pin older than the current
     * revision stays valid, and the current revision never replaces it.
     *
     * @throws ProfileRetired
     * @throws ProfileMissing
     */
    public function admittedPin(ProfileKey $key, int $revision): ProfileSnapshot;
}
