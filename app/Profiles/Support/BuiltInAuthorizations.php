<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Enums\AuthorizationType;
use App\Profiles\Enums\ProfileType;
use App\Profiles\Values\AbilityGrant;
use App\Profiles\Values\ProfileAuthorization;

/**
 * The built-in authorization of each kind of profile, as plain data in one place (doc 48 revision 4, section 5): a
 * broad agent does ordinary work but no administration, a writing helper its own task work, a read-only helper its
 * reports, comments and messages. Each family of commands adds its abilities here as its policy arrives.
 */
final class BuiltInAuthorizations
{
    public static function for(ProfileType $type): ProfileAuthorization
    {
        return new ProfileAuthorization(AuthorizationType::Policies, self::grantsFor($type));
    }

    /**
     * @return list<AbilityGrant>
     */
    private static function grantsFor(ProfileType $type): array
    {
        return match ($type) {
            ProfileType::MainAgent => [],
            ProfileType::WritingHelper => [],
            ProfileType::ReadOnlyHelper => [],
        };
    }
}
