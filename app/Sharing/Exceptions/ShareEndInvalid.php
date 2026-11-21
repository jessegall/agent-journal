<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Sharing\Enums\ShareState;
use LogicException;

/**
 * A share ends only as revoked or expired; any other state is no end.
 */
final class ShareEndInvalid extends LogicException
{
    public static function for(string $shareId, ShareState $state): self
    {
        return new self("Share {$shareId} cannot end as {$state->value}; it ends only as revoked or expired.");
    }
}
