<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;
use Throwable;

/**
 * A chat events cursor that does not belong to the reader's current membership of that chat, such as one from before
 * it rejoined: the reader starts again from a fresh snapshot.
 */
final class ChatCursorRefused extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    public static function forInbox(string $inboxId, Throwable|null $cause = null): self
    {
        return new self(
            "This cursor is not valid for chat {$inboxId} now; read the chat again from the start.",
            previous: $cause,
        );
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
