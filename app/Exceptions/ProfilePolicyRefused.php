<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Values\ProfileKey;
use InvalidArgumentException;

/**
 * A proposal whose resolved policy breaks a limit, refused before anything is activated.
 */
final class ProfilePolicyRefused extends InvalidArgumentException implements CommandRefusal
{
    public static function readOnlyCeiling(ProfileKey $key): self
    {
        return new self(
            sprintf(
                'Profile %s is a read-only helper that would change workspace files; a profile that changes the workspace must be a writing_helper.',
                $key,
            ),
        );
    }

    public static function protectedArea(ProfileKey $key): self
    {
        return new self("Profile {$key} grants access to a protected resource, which no policy grants.");
    }

    public static function unknownOperation(ProfileKey $key, string $operation): self
    {
        return new self("Profile {$key} names the operation {$operation}, which no trusted owner declares.");
    }

    public static function unknownCommand(ProfileKey $key, string $command): self
    {
        return new self("Profile {$key} denies {$command}, which is no registered application command.");
    }

    public static function writerOutsideContainer(ProfileKey $key): self
    {
        return new self("Profile {$key} is a writing helper, which always runs in a required container.");
    }

    public static function conflictingCondition(ProfileKey $key, string $condition): self
    {
        return new self("Profile {$key} defines the stop condition {$condition} twice, differently.");
    }

    public static function repeatedKey(ProfileKey $key): self
    {
        return new self("The proposal defines profile {$key} twice.");
    }
}
