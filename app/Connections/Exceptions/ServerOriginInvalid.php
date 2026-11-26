<?php

declare(strict_types=1);

namespace App\Connections\Exceptions;

use RuntimeException;

/**
 * The configured server origin (JOURNAL_SERVER_ORIGIN) is not an https origin, so no install line names it.
 */
final class ServerOriginInvalid extends RuntimeException
{
    public static function for(string $configured): self
    {
        return new self("The server origin '{$configured}' is not an https origin; set JOURNAL_SERVER_ORIGIN.");
    }
}
