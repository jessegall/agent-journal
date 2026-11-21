<?php

declare(strict_types=1);

namespace App\Profiles\Contracts;

use App\Agents\Values\ModelSelection;
use App\Profiles\Exceptions\ProfileMissing;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileSelection;

/**
 * Resolves a start from a profile's current revision: its program (asked for, the profile's own, or the parent
 * session's), its model by the profile's default and allowed models, and the policy it runs under.
 */
interface ProfileSelections
{
    /**
     * @throws ProfileMissing
     */
    public function select(
        ProfileKey $profile,
        ModelSelection $requested,
        string|null $driverKey,
        string|null $parentDriver,
    ): ProfileSelection;
}
