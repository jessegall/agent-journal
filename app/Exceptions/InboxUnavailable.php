<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * One public answer for an inbox that does not exist and one the actor may not use.
 */
final class InboxUnavailable extends RuntimeException implements CommandRefusal
{
    /**
     * @use ThrowsLater<InboxUnavailable>
     */
    use ThrowsLater;

    public static function forId(string $inboxId): self
    {
        return new self("Inbox {$inboxId} is not available.");
    }

    public static function forActor(string $actorId): self
    {
        return new self("Actor {$actorId} has no inbox.");
    }

    public static function forName(string $name): self
    {
        return new self("No inbox is named {$name}.");
    }
}
