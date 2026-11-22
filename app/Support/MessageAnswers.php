<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Message;
use Carbon\CarbonImmutable;

/**
 * Closes a question with its durable reply and releases its claim.
 */
final readonly class MessageAnswers
{
    public function __construct(private MessageClaims $claims) {}

    public function answer(Message $message, Message $reply, ActorIdentity $actor, CarbonImmutable $at): void
    {
        if ($message->answer_message_id === $reply->id) {
            return;
        }

        $message->answerWith($reply, $actor, $at);
        $this->claims->releaseAny($message);
    }
}
