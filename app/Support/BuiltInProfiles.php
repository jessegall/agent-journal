<?php

declare(strict_types=1);

namespace App\Support;

use App\Values\ProfileBase;
use App\Values\ProfileKey;

/**
 * The journal's own profiles, one per type of agent: every start without a profile of its own is pinned to its
 * type's, and their authorization is the built-in one of that type.
 */
final class BuiltInProfiles
{
    /**
     * Each built-in profile, proposed as it starts: its base's key, label and model, and nothing overridden.
     *
     * @return list<ProposedProfile>
     */
    public static function proposed(): array
    {
        return array_map(self::profile(...), ProfileBase::all());
    }

    public static function keyFor(ProfileBase $base): ProfileKey
    {
        return ProfileKey::from($base->key);
    }

    private static function profile(ProfileBase $base): ProposedProfile
    {
        return new ProposedProfile(
            ProfileKey::from($base->key),
            $base->label,
            $base,
            '',
            $base->model,
            null,
            false,
            [],
            null,
            [],
            null,
            PolicyOverride::none(),
            [],
            description: $base->description,
        );
    }
}
