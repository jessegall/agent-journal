<?php

declare(strict_types=1);

namespace Domain\Chat\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;
use Throwable;

/**
 * The actor may not take part in a conversation with that peer; an outsider and a member asking about another peer
 * are refused alike.
 */
final class ConversationUnavailable extends RuntimeException implements CommandRefusal
{
    public static function missing(string $id): self
    {
        return new self("No conversation {$id} is available.");
    }

    public static function withPeer(Throwable $cause): self
    {
        return new self('This conversation is not available.', 0, $cause);
    }
}
