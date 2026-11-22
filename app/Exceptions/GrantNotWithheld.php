<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CommandRefusal;
use App\Enums\AccessType;
use InvalidArgumentException;

/**
 * A profile that withholds a grant its base does not hold, such as a misspelt one; it would narrow nothing.
 */
final class GrantNotWithheld extends InvalidArgumentException implements CommandRefusal
{
    public static function for(string $policy, AccessType $access): self
    {
        return new self(sprintf(
            'The profile withholds %s on %s, which its base does not grant. Name a grant the base holds.',
            $access->value,
            $policy,
        ));
    }
}
