<?php

declare(strict_types=1);

namespace Tests\Fixtures\Profiles;

use App\Enums\Profiles\ModelTier;
use App\Support\DefaultDrivers;
use App\Enums\Profiles\InstancePolicy;
use App\Support\PolicyOverride;
use App\Support\ProfileProposal;
use App\Support\ProposedProfile;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use App\Values\WithheldGrant;

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
        ModelTier $tier = ModelTier::Inventive,
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
            $tier,
            DefaultDrivers::CODEX,
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
