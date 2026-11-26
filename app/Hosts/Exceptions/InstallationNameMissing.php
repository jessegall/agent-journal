<?php

declare(strict_types=1);

namespace App\Hosts\Exceptions;

use RuntimeException;

/**
 * A contained journal has no installation name, so its containers, networks and volumes could not be told apart
 * from another journal's on the same agent daemon.
 */
final class InstallationNameMissing extends RuntimeException
{
    public static function whenContained(): self
    {
        return new self('AGENTS_ARRANGEMENT is contained: set AGENTS_INSTALLATION_NAME, or run it through compose.');
    }
}
