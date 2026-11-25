<?php

declare(strict_types=1);

namespace App\Support\States\Support;

use App\Models\Messages\Message;
use App\Support\Decisions\StateReferenceFactory;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;

/**
 * Builds the answering state of one message for one agent.
 */
final class AnswerMessageStateReference extends StateReferenceFactory
{
    public const string TYPE_KEY = 'core.messages.answer';

    public static function forMessage(Message $message, string $agentId): StateReference
    {
        return self::about(new SubjectReference($message->id, 0), [
            'messageId' => $message->id,
            'messageNumber' => $message->number,
            'inboxId' => $message->inbox_id,
            'agentId' => $agentId,
        ]);
    }
}
