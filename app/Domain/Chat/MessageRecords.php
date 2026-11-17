<?php

declare(strict_types=1);

namespace App\Domain\Chat;

use App\Domain\Chat\Models\Message;

/**
 * The named reads of messages the Chat domain answers for.
 */
final readonly class MessageRecords
{
    public function get(int $messageId): Message
    {
        return Message::query()->find($messageId) ?? throw MessageMissing::forId($messageId);
    }
}
