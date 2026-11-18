<?php

declare(strict_types=1);

namespace Domain\Chat\States\Support;

use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use Domain\Chat\Models\Message;

/**
 * The stack reference of answering one message; a message is answered once, so it has one run.
 */
final class AnsweringMessageStateReference
{
    public const string TYPE_KEY = 'chat.answering';

    public static function forMessage(Message $message): StateReference
    {
        return new StateReference(self::TYPE_KEY, new SubjectReference($message->id, 1));
    }
}
