<?php

declare(strict_types=1);

namespace App\Communication\Commands\AnswerMessage;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\CurrentSession;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Models\Message;
use App\Communication\Support\ChatPosting;
use App\Communication\Support\MessageAnswers;
use App\Communication\Support\MessageReading;
use App\Contracts\CommandHandler;
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
