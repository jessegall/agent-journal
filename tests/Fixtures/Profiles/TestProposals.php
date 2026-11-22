<?php

declare(strict_types=1);

namespace Tests\Fixtures\Profiles;

use App\Drivers\Support\DefaultDrivers;
use App\Profiles\Enums\InstancePolicy;
use App\Profiles\Support\PolicyOverride;
use App\Profiles\Support\ProfileProposal;
use App\Profiles\Support\ProposedProfile;
use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\WithheldGrant;

/**
 * Proposals of profiles that take every policy field from their type's defaults, as tests that only need some
 * activated profile use.
 */
final class TestProposals
{
    /**
     * @param  list<string>|null  $skillAllowlist
     * @param  list<string>  $requiredSkills
     * @param  list<WithheldGrant>  $withheldGrants
     */
    public static function profile(
        string $key,
        ProfileBase $type,
        string $instructions = 'Work.',
        string $model = 'opus',
        array|null $skillAllowlist = null,
        array $requiredSkills = [],
        array $withheldGrants = [],
        InstancePolicy $instances = InstancePolicy::Reusable,
    ): ProposedProfile {
        return new ProposedProfile(
            ProfileKey::from($key),
            $key,
            $type,
            $instructions,
            $model,
            DefaultDrivers::CODEX,
            false,
            ['opus', 'sonnet'],
            $skillAllowlist,
            $requiredSkills,
            null,
            PolicyOverride::none(),
            [],
            $withheldGrants,
            instances: $instances,
        );
    }

    public static function of(ProposedProfile ...$profiles): ProfileProposal
    {
        return new ProfileProposal(1, [], array_values($profiles));
    }
}
