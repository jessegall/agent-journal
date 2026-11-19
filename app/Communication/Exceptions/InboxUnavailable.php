<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * One public answer for an inbox that does not exist and one the actor may not use.
 */
final class InboxUnavailable extends RuntimeException implements CommandRefusal
{
    public static function forId(string $inboxId): self
    {
        return new self("Inbox {$inboxId} is not available.");
    }
}
