<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use App\Profiles\Enums\ProfileType;
use App\Profiles\Values\ProfileKey;
use RuntimeException;

/**
 * A launch that needs one profile type from a profile of another, such as a main launch from a helper profile.
 */
final class ProfileTypeConflict extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function for(ProfileKey $key, ProfileType $needed, ProfileType $actual): self
    {
        return new self("Profile {$key} is a {$actual->value} profile; this launch needs a {$needed->value} profile.");
    }

    protected function status(): int
    {
        return 422;
    }
}
