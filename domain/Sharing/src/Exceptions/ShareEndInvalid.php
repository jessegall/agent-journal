<?php

declare(strict_types=1);

namespace Domain\Sharing\Exceptions;

use Domain\Sharing\Enums\ShareStatus;
use LogicException;

/**
 * A share ends only as revoked or expired; any other state is no end.
 */
final class ShareEndInvalid extends LogicException
{
    public static function for(string $shareId, ShareStatus $status): self
    {
        return new self("Share {$shareId} cannot end as {$status->value}; it ends only as revoked or expired.");
    }
}
