<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;
use Throwable;

/**
 * The driver answered the login start with something that does not read as a device code, so the user can never be
 * shown one and the attempt ends at once instead of waiting for its deadline.
 */
final class SignInChallengeUnreadable extends RuntimeException
{
    public static function fromLoginStart(Throwable $cause): self
    {
        return new self(
            'The sign-in answered without a device code the journal can read; start a fresh sign-in.',
            0,
            $cause,
        );
    }
}
