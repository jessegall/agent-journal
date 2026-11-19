<?php

declare(strict_types=1);

namespace App\Communication\States\Support;

use App\Communication\Models\Message;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferenceFactory;
use App\Hooks\Decisions\SubjectReference;

/**
 * The stack reference of answering one message in one answer round: asking again opens a new round, and so a new
 * reference, while a frame of an earlier round stays finished.
 */
final class AnsweringMessageStateReference extends StateReferenceFactory
{
    public const string TYPE_KEY = 'communication.answering';

    public static function forMessage(Message $message): StateReference
    {
        return self::forRound($message->id, $message->answer_round);
    }

    public static function forRound(string $messageId, int $round): StateReference
    {
        return self::about(new SubjectReference($messageId, $round));
    }
}
