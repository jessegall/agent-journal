<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use RuntimeException;

/**
 * A sign-in program cannot start on this host.
 */
final class SignInProtocolMissing extends RuntimeException
{
    public static function cannotStart(string $command): self
    {
        return new self("The sign-in program {$command} could not be started on this host.");
    }
}
