<?php

declare(strict_types=1);

namespace Domain\Chat\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;
use Throwable;

/**
 * A chat the caller may not see or did not name clearly, refused like a missing one.
 */
final class ChatUnavailable extends RuntimeException implements CommandRefusal
{
    public static function notAttached(string $inboxId): self
    {
        return new self("Chat {$inboxId} is not available.");
    }

    /**
     * The pair chat with an agent the caller may not see, refused like a missing one.
     */
    public static function withHiddenAgent(string $agentId, Throwable $refused): self
    {
        return new self("Chat {$agentId} is not available.", previous: $refused);
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
