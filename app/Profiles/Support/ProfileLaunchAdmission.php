<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Actors\Contracts\AuthoritySource;
use App\Agents\Contracts\LaunchProfileAdmission;
use App\Agents\Exceptions\CredentialRejected;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Exceptions\ProfileMissing;
use App\Profiles\Exceptions\ProfileRetired;
use App\Profiles\Values\LaunchProfileAuthority;
use App\Profiles\Values\ProfileKey;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Loads the admitted profile revision an agent's launch was pinned to; any reason it cannot is the same rejected
 * credential, so a reply never tells whether a profile exists.
 */
final readonly class ProfileLaunchAdmission implements LaunchProfileAdmission
{
    public function __construct(private ProfileResolver $profiles) {}

    public function admit(string $profileKey, int $profileRevision): AuthoritySource
    {
        try {
            return new LaunchProfileAuthority($this->profiles->admittedPin(ProfileKey::from($profileKey), $profileRevision));
        } catch (ProfileRetired|ProfileMissing|ModelNotFoundException) {
            throw CredentialRejected::profileMismatched();
        }
    }
}
