<?php

declare(strict_types=1);

namespace App\Exceptions;

use RuntimeException;

/**
 * The installation has no designated main agent yet, because agents:install has not run.
 */
final class MainAgentMissing extends RuntimeException
{
    public static function forInstallation(): self
    {
        return new self('This installation has no main agent yet; run php artisan agents:install.');
    }
}
