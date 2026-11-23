<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Sessions\ProfileRules;
use App\Values\ProfileKey;
use App\Values\ProfileRuleGroups;

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
