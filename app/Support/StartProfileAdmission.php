<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Admission\StartProfileAdmission as StartProfileAdmissionContract;
use App\Contracts\Authorization\AuthoritySource;
use App\Contracts\Sessions\ProfileResolver;
use App\Exceptions\CredentialRejected;
use App\Exceptions\ProfileMissing;
use App\Exceptions\ProfileRetired;
use App\Values\ProfileKey;
use App\Values\StartProfileAuthority;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Loads the admitted profile revision an agent's start was pinned to; any reason it cannot is the same rejected
 * credential, so a reply never tells whether a profile exists.
 */
final readonly class StartProfileAdmission implements StartProfileAdmissionContract
{
    public function __construct(private ProfileResolver $profiles) {}

    public function admit(string $profileKey, int $revision): AuthoritySource
    {
        try {
            return new StartProfileAuthority(
                $this->profiles->admittedPin(ProfileKey::from($profileKey), $revision),
            );
        } catch (ProfileRetired|ProfileMissing|ModelNotFoundException $cause) {
            throw CredentialRejected::profileMismatched(previous: $cause);
        }
    }
}
