<?php

declare(strict_types=1);

namespace App\Profiles\Exceptions;

use RuntimeException;

/**
 * No sign-in protocol is installed on this host for the program, or its program cannot start here.
 */
final class SignInProtocolMissing extends RuntimeException
{
    public static function for(string $program): self
    {
        return new self("No sign-in protocol for {$program} is installed on this host.");
    }

    public static function cannotStart(string $command): self
    {
        return new self("The sign-in program {$command} could not be started on this host.");
    }
}
