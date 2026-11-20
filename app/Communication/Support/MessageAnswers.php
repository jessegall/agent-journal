<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorIdentity;
use App\Communication\Events\MessageAnswered;
use App\Communication\Models\Message;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Closes a question with its durable reply and releases its claim.
 */
final readonly class MessageAnswers
{
    public function __construct(private MessageClaims $claims, private Dispatcher $events) {}

    public function answer(Message $message, Message $reply, ActorIdentity $actor, CarbonImmutable $at): void
    {
        if ($message->answer_message_id === $reply->id) {
            return;
        }

        $message->answerWith($reply, $actor, $at);
        $this->claims->releaseAny($message);
        $this->events->dispatch(new MessageAnswered($message->id, $reply->id, $actor));
    }
}
