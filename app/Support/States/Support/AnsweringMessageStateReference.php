<?php

declare(strict_types=1);

namespace App\Support\States\Support;

use App\Events\ChatMessageOffered;
use App\Models\Messages\Message;
use App\Support\AssigneeIdentity;
use App\Support\Decisions\StateReferenceFactory;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;

/**
 * The answering frame of one agent in one chat, made with the first message that waits for its answer.
 */
final class AnsweringMessageStateReference extends StateReferenceFactory
{
    public const string TYPE_KEY = 'core.messages.answering';

    public static function forOffer(ChatMessageOffered $offer): StateReference
    {
        return self::waiting($offer->inboxId, $offer->agent->id, $offer->messageId);
    }

    public static function forClaim(Message $message, AssigneeIdentity $holder): StateReference
    {
        return self::waiting($message->destination_inbox_id, $holder->id, $message->id);
    }

    private static function waiting(string $inboxId, string $agentId, string $messageId): StateReference
    {
        return self::about(new SubjectReference($inboxId, 0), [
            'inboxId' => $inboxId,
            'agentId' => $agentId,
            'waitingIds' => [$messageId],
        ]);
    }
}
