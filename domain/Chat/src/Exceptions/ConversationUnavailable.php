<?php

declare(strict_types=1);

namespace Domain\Chat\Exceptions;

use App\Contracts\Bus\CommandRefusal;
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

    public static function closed(string $id): self
    {
        return new self("Conversation {$id} is closed.");
    }

    public static function unnamed(): self
    {
        return new self('You are in several chats: name the one to use with --chat and its inbox id.');
    }

    public static function none(): self
    {
        return new self('You are in no chat yet: open the chat first, or name one with --chat.');
    }

    /**
     * A repeated send whose message the caller can no longer see; it names no message.
     */
    public static function sentMessageHidden(): self
    {
        return new self('The message this request sent is no longer available to you.');
    }

    public static function withPeer(Throwable $cause): self
    {
        return new self('This conversation is not available.', 0, $cause);
    }
}
