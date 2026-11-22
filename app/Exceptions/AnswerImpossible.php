<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;

/**
 * An answer to a message that was dismissed, which can no longer be answered.
 */
final class AnswerImpossible extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forInbox(string $inboxId): self
    {
        return new self("Nobody sits at inbox {$inboxId} to answer a question.");
    }

    public static function forMessage(string $messageId): self
    {
        return new self("Message {$messageId} was dismissed and cannot be answered.");
    }

    protected function status(): int
    {
        return 409;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
