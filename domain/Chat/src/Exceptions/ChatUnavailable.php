<?php

declare(strict_types=1);

namespace Domain\Chat\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

/**
 * A chat the caller may not see or did not name clearly, refused like a missing one.
 */
final class ChatUnavailable extends RuntimeException implements CommandRefusal
{
    public static function notAttached(string $inboxId): self
    {
        return new self("Chat {$inboxId} is not available.");
    }

    public static function none(): self
    {
        return new self('You are in no chat yet.');
    }

    public static function unnamed(): self
    {
        return new self('You are in several chats: name the chat by its inbox id.');
    }
}
