<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use App\Agents\Enums\AccessType;
use App\Bus\Contracts\CommandRefusal;
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
