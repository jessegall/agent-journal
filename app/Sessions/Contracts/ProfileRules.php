<?php

declare(strict_types=1);

namespace App\Sessions\Contracts;

use App\Sessions\Values\ProfileRuleGroups;
use App\Values\ProfileKey;

/**
 * The rules a profile works under, in the groups that hold them; a domain that keeps rules answers it, and without one
 * the answer says the rules were not read.
 */
interface ProfileRules
{
    /**
     * The rules the profile adds, grouped as the agent is given them.
     */
    public function of(ProfileKey $profile): ProfileRuleGroups;
}
