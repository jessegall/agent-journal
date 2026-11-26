<?php

declare(strict_types=1);

namespace App\Profiles;

use App\Sessions\Contracts\ProfileRules;
use App\Sessions\Values\ProfileRuleGroups;
use App\Values\ProfileKey;

/**
 * The profile rules while no domain keeps rules: they were not read.
 */
final readonly class UnreadProfileRules implements ProfileRules
{
    public function of(ProfileKey $profile): ProfileRuleGroups
    {
        return ProfileRuleGroups::unread();
    }
}
