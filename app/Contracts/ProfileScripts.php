<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Exceptions\ProfileMissing;
use App\Values\ProfileKey;
use App\Values\ProfileScript;
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
