<?php

declare(strict_types=1);

namespace App\Domain\Chat;

use App\Core\Hooks\Storage\StackTarget;
use App\Domain\Chat\Exceptions\MessageMissing;
use App\Domain\Chat\Models\Message;

/**
 * The named reads of messages the Chat domain answers for: the calling agent's own, and one the journal addressed.
 */
final readonly class MessageRecords
{
    public function get(int $messageId): Message
    {
        return Message::query()->find($messageId) ?? throw MessageMissing::forId($messageId);
    }

    /**
     * The journal's own read of a message it addressed to an agent, outside that agent's requests.
     */
    public function addressedTo(StackTarget $target, int $messageId): Message
    {
        return Message::query()->ownedBy($target->agentId)->find($messageId) ?? throw MessageMissing::forId($messageId);
    }
}
