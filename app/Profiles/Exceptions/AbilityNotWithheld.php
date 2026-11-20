<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A profile that withholds an ability its base does not grant, such as a misspelt one; it would narrow nothing.
 */
final class AbilityNotWithheld extends InvalidArgumentException implements CommandRefusal
{
    public static function for(string $policy, string $ability): self
    {
        return new self(sprintf(
            'The profile withholds %s of %s, which its base does not grant. Name an ability the base grants.',
            $ability,
            $policy,
        ));
    }
}
