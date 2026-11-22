<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use RuntimeException;

/**
 * The user's answer may not have reached the driver: writing it failed or stopped partway, so whether the driver
 * took it is unknown and it is never given again.
 */
final class SignInAnswerUndelivered extends RuntimeException
{
    public static function toDriver(): self
    {
        return new self('The answer could not be handed to the sign-in in full; start a fresh sign-in.');
    }
}
