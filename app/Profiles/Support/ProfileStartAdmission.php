<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Actors\Contracts\AuthoritySource;
use App\Agents\Contracts\StartProfileAdmission;
use App\Agents\Exceptions\CredentialRejected;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Exceptions\ProfileMissing;
use App\Profiles\Exceptions\ProfileRetired;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\StartProfileAuthority;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Loads the admitted profile revision an agent's start was pinned to; any reason it cannot is the same rejected
 * credential, so a reply never tells whether a profile exists.
 */
final readonly class ProfileStartAdmission implements StartProfileAdmission
{
    public function __construct(private ProfileResolver $profiles) {}

    public function admit(string $profileKey, int $profileRevision): AuthoritySource
    {
        try {
            return new StartProfileAuthority(
                $this->profiles->admittedPin(ProfileKey::from($profileKey), $profileRevision),
            );
        } catch (ProfileRetired|ProfileMissing|ModelNotFoundException) {
            throw CredentialRejected::profileMismatched();
        }
    }
}
