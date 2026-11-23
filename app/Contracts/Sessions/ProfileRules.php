<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

use App\Values\ProfileKey;
use App\Values\ProfileRuleGroups;

/**
 * The rules a profile works under, in the groups that hold them; a domain that keeps rules answers it, and without one
 * the answer says the rules were not read.
 */
interface ProfileRules
{
    public function of(ProfileKey $profile): ProfileRuleGroups;
}
