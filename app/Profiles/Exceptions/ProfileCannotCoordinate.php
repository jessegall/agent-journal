<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use App\Profiles\Values\ProfileKey;
use RuntimeException;

/**
 * A main launch names a profile whose base does not coordinate the journal's work.
 */
final class ProfileCannotCoordinate extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function for(ProfileKey $key): self
    {
        return new self("Profile {$key} does not coordinate the journal's work, so it cannot run as the main agent.");
    }

    protected function status(): int
    {
        return 422;
    }
}
