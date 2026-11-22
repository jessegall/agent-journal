<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Exceptions\ProfileMissing;
use App\Values\ModelSelection;
use App\Values\ProfileKey;
use App\Values\ProfileSelection;

/**
 * Resolves a start from a profile's current revision: its driver (asked for, the profile's own, or the parent
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
