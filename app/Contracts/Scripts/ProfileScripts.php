<?php

declare(strict_types=1);

namespace App\Contracts\Scripts;

use App\Exceptions\ProfileMissing;
use App\Values\ProfileKey;
use App\Values\ProfileScript;

/**
 * Reads the script a profile revision runs, for the Core areas that run it.
 */
interface ProfileScripts
{
    /**
     * The script the profile's revision with this number runs, retired or not; the empty script when it has none.
     *
     * @throws ProfileMissing when no profile has this key
     */
    public function scriptAt(ProfileKey $key, int $revision): ProfileScript;
}
