<?php

declare(strict_types=1);

namespace Tests\Fixtures\Profiles;

use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileLaunchPolicy;
use App\Programs\Enums\HookProgram;

/**
 * The global default launch policy of a profile type, pinned to Claude Code, as tests that only need a valid policy
 * use.
 */
final class TestLaunchPolicies
{
    public static function for(ProfileBase $type): ProfileLaunchPolicy
    {
        return ProfileLaunchPolicy::defaultsFor(
            $type,
            HookProgram::ClaudeCode,
            true,
            ['opus', 'sonnet'],
            hash('sha256', "test defaults of {$type->key}"),
        );
    }
}
