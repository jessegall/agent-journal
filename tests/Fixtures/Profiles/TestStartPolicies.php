<?php

declare(strict_types=1);

namespace Tests\Fixtures\Profiles;

use App\Drivers\Enums\HookDriver;
use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileStartPolicy;

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
            HookDriver::ClaudeCode,
            true,
            ['opus', 'sonnet'],
            hash('sha256', "test defaults of {$type->key}"),
        );
    }
}
