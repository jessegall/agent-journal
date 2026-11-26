<?php

declare(strict_types=1);

namespace App\Sessions\Exceptions;

use App\Values\ProfileKey;
use RuntimeException;

final class ProfileRetired extends RuntimeException
{
    public static function for(ProfileKey $key): self
    {
        return new self("The profile {$key} is retired: activate it again or choose a current profile.");
    }
}
