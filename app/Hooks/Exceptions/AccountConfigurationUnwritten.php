<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use RuntimeException;

/**
 * An account's configuration file could not be replaced; the old file stays whole and no start uses the new trust.
 */
final class AccountConfigurationUnwritten extends RuntimeException
{
    public static function at(string $path): self
    {
        return new self("The account configuration {$path} could not be replaced; it is left as it was.");
    }
}
