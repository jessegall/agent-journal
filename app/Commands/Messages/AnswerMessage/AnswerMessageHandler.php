<?php

declare(strict_types=1);

namespace App\Commands\Messages\AnswerMessage;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Sessions\CurrentSession;
use App\Exceptions\MessageMissing;
use App\Models\Messages\Message;
use App\Support\ActorIdentity;
use App\Support\ChatService;
use App\Support\MessageService;
use Carbon\CarbonImmutable;

final readonly class AnswerMessageHandler implements CommandHandler
{
    public function __construct(
        private CurrentSession $session,
        private MessageService $messages,
        private ChatService $chats,
    ) {}

    public function handle(AnswerMessageCommand $command): string
    {
        $dispatcher = $command->dispatchedBy();
        $question = Message::visibleById($command->messageId);
        $reply = Message::visibleById($command->replyId);

        if ($question->isChat()) {
            return $this->chats->linkAnswer($question, $reply, $dispatcher);
        }

        $member = $this->messages->recipientOf($command->messageId, $dispatcher);
        $message = Message::lockedById($command->messageId);
        $actor = ActorIdentity::of($dispatcher);
        $sessionId = $this->session->hasSession() ? $this->session->sessionId() : null;

        if (! $reply->isReplyBy($message, $actor, $sessionId)) {
            throw MessageMissing::forId($command->replyId);
        }

        $now = CarbonImmutable::now();
        $message->acknowledge($member, $now);
        $this->messages->answer($message, $reply, $actor, $now);

        return $reply->id;
    }
}
