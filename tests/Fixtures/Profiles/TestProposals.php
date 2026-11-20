<?php

declare(strict_types=1);

namespace Tests\Fixtures\Profiles;

use App\Profiles\Support\PolicyOverride;
use App\Profiles\Support\ProfileProposal;
use App\Profiles\Support\ProposedProfile;
use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\WithheldAbility;
use App\Programs\Enums\HookProgram;

/**
 * Proposals of profiles that take every policy field from their type's defaults, as tests that only need some
 * activated profile use.
 */
final class TestProposals
{
    /**
     * @param  list<string>|null  $skillAllowlist
     * @param  list<string>  $requiredSkills
     * @param  list<WithheldAbility>  $withheldAbilities
     */
    public static function profile(
        string $key,
        ProfileBase $type,
        string $instructions = 'Work.',
        string $model = 'opus',
        array|null $skillAllowlist = null,
        array $requiredSkills = [],
        array $withheldAbilities = [],
    ): ProposedProfile {
        return new ProposedProfile(
            ProfileKey::from($key),
            $key,
            $type,
            $instructions,
            $model,
            HookProgram::Codex,
            false,
            ['opus', 'sonnet'],
            $skillAllowlist,
            $requiredSkills,
            null,
            PolicyOverride::none(),
            [],
            $withheldAbilities,
        );
    }

    public static function of(ProposedProfile ...$profiles): ProfileProposal
    {
        return new ProfileProposal(1, [], array_values($profiles));
    }
}
