<?php

declare(strict_types=1);

namespace Tests\Fixtures\Profiles;

use App\Support\DefaultDrivers;
use App\Values\ProfileBase;
use App\Values\ProfileStartPolicy;

/**
 * The global default start policy of a profile type, pinned to Claude Code, as tests that only need a valid policy
 * use.
 */
final class TestStartPolicies
{
    public static function for(ProfileBase $type): ProfileStartPolicy
    {
        return ProfileStartPolicy::defaultsFor(
            $type,
            DefaultDrivers::CLAUDE_CODE,
            hash('sha256', "test defaults of {$type->key}"),
        );
    }
}
