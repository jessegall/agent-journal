<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use InvalidArgumentException;

/**
 * An access policy that grants what no policy may: a protected resource.
 */
final class AccessPolicyInvalid extends InvalidArgumentException implements CommandRefusal
{
    public static function protectedGrant(): self
    {
        return new self('The policy grants protected resources, which no policy may grant.');
    }
}
