<?php

declare(strict_types=1);

namespace Domain\Chat\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * A change to who is in a chat that its rules refuse: only its owner changes the roster, the target must be eligible,
 * a chat holds at most a hundred members, and the last owner hands over before it leaves.
 */
final class ChatMembershipRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    public static function mayNotCreate(): self
    {
        return new self('You may not open chats here.');
    }

    public static function notOwner(string $inboxId): self
    {
        return new self("Only the owner of chat {$inboxId} may change who is in it.");
    }

    public static function notEligible(string $inboxId): self
    {
        return new self("That user may not be added to chat {$inboxId}.");
    }

    public static function rosterFull(string $inboxId, int $limit): self
    {
        return new self("Chat {$inboxId} already holds {$limit} members.");
    }

    public static function notMember(string $inboxId): self
    {
        return new self("That actor is not a member of chat {$inboxId}.");
    }

    public static function lastOwner(string $inboxId): self
    {
        return new self("You own chat {$inboxId}: hand it to another member or close it before you leave.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
