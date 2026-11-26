<?php

declare(strict_types=1);

namespace App\Sessions\Contracts;

use App\Exceptions\ProfileMissing;
use App\Sessions\Values\ProfileSelection;
use App\Values\ModelSelection;
use App\Values\ProfileKey;

/**
 * Resolves a start from a profile's current revision: its driver (asked for, the profile's preferred one, or the
 * parent session's), its model (asked for, or the family's model at the profile's tier) and the policy it runs under.
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
