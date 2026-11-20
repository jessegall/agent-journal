<?php

declare(strict_types=1);

namespace App\Profiles\Contracts;

use App\Profiles\Exceptions\ProfileMissing;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileScript;
use PhpOption\Option;

/**
 * Reads the script a profile revision runs, for the Core areas that run it.
 */
interface ProfileScripts
{
    /**
     * The script the profile's revision with this number runs, retired or not; none when it has no script.
     *
     * @return Option<ProfileScript>
     *
     * @throws ProfileMissing when no profile has this key
     */
    public function scriptAt(ProfileKey $key, int $revision): Option;
}
