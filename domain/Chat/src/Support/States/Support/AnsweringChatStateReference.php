<?php

declare(strict_types=1);

namespace Domain\Chat\Support\States\Support;

use App\Support\Decisions\StateReferenceFactory;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;

/**
 * The frame of an agent that owes an answer in one chat, named by that chat: every message sent to it there piles
 * up in the same frame.
 */
final class AnsweringChatStateReference extends StateReferenceFactory
{
    public const string TYPE_KEY = 'chat.answering';

    public static function forChat(string $inboxId): StateReference
    {
        return self::about(new SubjectReference($inboxId, 0));
    }
}
