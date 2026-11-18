<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use RuntimeException;

/**
 * The owner commands run as the journal's one configured owner, and there is none.
 */
final class SharingOwnerMissing extends RuntimeException
{
    public static function forConsole(): self
    {
        return new self('No owner is configured for this journal; set the owner before managing shares from the command line.');
    }
}
