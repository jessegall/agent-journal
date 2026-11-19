<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Profiles\Enums\ProfileType;
use LogicException;

final class BuiltInProfileMissing extends LogicException
{
    public static function forType(ProfileType $type): self
    {
        return new self("No built-in profile serves the profile type {$type->value}.");
    }
}
