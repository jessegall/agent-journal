<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Profiles\Values\ProfileKey;
use RuntimeException;

final class ProfileMissing extends RuntimeException
{
    public static function for(ProfileKey $key): self
    {
        return new self("There is no profile {$key}.");
    }
}
