<?php

declare(strict_types=1);

namespace App\Domain\Chat;

use App\Domain\Chat\Models\Message;
use App\Domain\Hooks\Decisions\StateReference;
use App\Domain\Hooks\Decisions\SubjectReference;

/**
 * The stack reference of answering one message; a message is answered once, so it has one run.
 */
final class AnsweringMessageReference
{
    public const TYPE_KEY = 'chat.answering';

    public static function forMessage(Message $message): StateReference
    {
        return new StateReference(self::TYPE_KEY, new SubjectReference($message->id, 1));
    }
}
