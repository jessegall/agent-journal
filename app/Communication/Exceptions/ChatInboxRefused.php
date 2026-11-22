<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A desk-only read or write named a chat inbox: a chat is read only through its members' receipts.
 */
final class ChatInboxRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function forInbox(string $inboxId): self
    {
        return new self("Inbox {$inboxId} is a chat: read it through the chat itself.");
    }

    /**
     * Desk mail sent, asked or replied into a chat inbox, which only chat posting writes to.
     */
    public static function forDeskPosting(string $inboxId): self
    {
        return new self("Inbox {$inboxId} is a chat: post in it as a chat message.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::RecordUnavailable;
    }
}
