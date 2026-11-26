<?php

declare(strict_types=1);

namespace App\Sessions\Exceptions;

use InvalidArgumentException;

/**
 * A relay's settings name an offline reply the journal never grants, so they were changed by hand.
 */
final class OfflineReplyModeInvalid extends InvalidArgumentException
{
    public static function for(string $modeText): self
    {
        return new self(
            "The start names the offline reply '{$modeText}', which the journal never grants;"
            .' start again.',
        );
    }
}
