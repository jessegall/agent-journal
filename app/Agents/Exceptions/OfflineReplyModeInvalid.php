<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use InvalidArgumentException;

/**
 * A relay's settings name an offline reply the journal never grants, so they were changed by hand.
 */
final class OfflineReplyModeInvalid extends InvalidArgumentException
{
    public static function for(string $value): self
    {
        return new self("The start names the offline reply '{$value}', which the journal never grants; start again.");
    }
}
