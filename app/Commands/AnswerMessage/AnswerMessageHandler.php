<?php

declare(strict_types=1);

namespace App\Commands\AnswerMessage;

use App\Contracts\CommandHandler;
use App\Contracts\CurrentSession;
use App\Exceptions\MessageMissing;
use App\Models\Message;
use App\Support\ActorIdentity;
use App\Support\ChatPosting;
use App\Support\MessageAnswers;
use App\Support\MessageReading;
use Carbon\CarbonImmutable;

final readonly class AnswerMessageHandler implements CommandHandler
{
    public function __construct(
        private CurrentSession $session,
        private MessageReading $reading,
        private MessageAnswers $answers,
        private ChatPosting $chats,
    ) {}

    public function handle(AnswerMessageCommand $command): string
    {
        $dispatcher = $command->dispatchedBy();
        $question = Message::visibleById($command->messageId);
        $reply = Message::visibleById($command->replyId);

        if ($question->isChat()) {
            return $this->chats->linkAnswer($question, $reply, $dispatcher);
        }

        $member = $this->reading->recipientOf($command->messageId, $dispatcher);
        $message = Message::lockedById($command->messageId);
        $actor = ActorIdentity::of($dispatcher);
        $sessionId = $this->session->hasSession() ? $this->session->sessionId() : null;

        if (! $reply->isReplyBy($message, $actor, $sessionId)) {
            throw MessageMissing::forId($command->replyId);
        }

        $now = CarbonImmutable::now();
        $message->acknowledge($member, $now);
        $this->answers->answer($message, $reply, $actor, $now);

        return $reply->id;
    }
}
