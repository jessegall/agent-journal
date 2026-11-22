<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use RuntimeException;

/**
 * A desk-only change asked of a chat message: a chat post never becomes a question afterwards, only its respondent
 * settles a question asked of someone, and a chat row is never a session's selected message.
 */
final class ChatMessageRefused extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    public static function conversion(string $messageId): self
    {
        return new self("Message {$messageId} is a chat post: ask a new question instead of turning it into one.");
    }

    public static function notRespondent(string $messageId): self
    {
        return new self("Only the member question {$messageId} was asked of may settle it.");
    }

    public static function notSelectable(string $messageId): self
    {
        return new self("Message {$messageId} is a chat message: claim your turn on it instead of selecting it.");
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::Conflict;
    }
}
