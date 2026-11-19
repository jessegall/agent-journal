<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Exceptions\BuiltInProfileMissing;
use App\Profiles\Enums\ProfileType;
use App\Profiles\Values\ProfileKey;

/**
 * The journal's own profiles, one per type of agent: every launch without a profile of its own is pinned to its
 * type's, and their authorization is the built-in one of that type.
 */
final class BuiltInProfiles
{
    /**
     * @return list<ProposedProfile>
     */
    public static function proposed(): array
    {
        return [
            self::profile('main-agent', 'Main agent', ProfileType::MainAgent, 'opus'),
            self::profile('writing-helper', 'Writing helper', ProfileType::WritingHelper, 'sonnet'),
            self::profile('read-only-helper', 'Read-only helper', ProfileType::ReadOnlyHelper, 'sonnet'),
        ];
    }

    public static function keyFor(ProfileType $type): ProfileKey
    {
        foreach (self::proposed() as $profile) {
            if ($profile->type === $type) {
                return $profile->key;
            }
        }

        throw BuiltInProfileMissing::forType($type);
    }

    private static function profile(string $key, string $label, ProfileType $type, string $model): ProposedProfile
    {
        return new ProposedProfile(
            ProfileKey::from($key),
            $label,
            $type,
            '',
            $model,
            null,
            false,
            [],
            null,
            [],
            null,
            PolicyOverride::none(),
            [],
        );
    }
}
