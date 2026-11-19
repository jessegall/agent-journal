<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Contracts\CommandRefusal;
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
