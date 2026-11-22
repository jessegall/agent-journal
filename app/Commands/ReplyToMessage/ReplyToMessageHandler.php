<?php

declare(strict_types=1);

namespace App\Commands\ReplyToMessage;

use App\Commands\ReplyInChat\ReplyInChatCommand;
use App\Contracts\Bus\CommandHandler;
use App\Exceptions\AnswerImpossible;
use App\Exceptions\MessageMissing;
use App\Exceptions\MessageStateConflict;
use App\Models\Message;
use App\Support\ActorIdentity;
use App\Support\ChatPosting;
use App\Support\MessageAnswers;
use App\Support\MessageReading;
use App\Support\MessageSending;
use App\Support\RequestKey;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;

final readonly class ReplyToMessageHandler implements CommandHandler
{
    public function __construct(
        private MessageReading $reading,
        private MessageSending $sending,
        private MessageAnswers $answers,
        private ChatPosting $chats,
        private RequestKey $key,
    ) {}

    /**
     * Any member of the destination inbox may answer, not only the first reader; answering a waiting message closes
     * it and ends its claim, and a reply to an answered one is a follow-up.
     *
     * @throws MessageMissing
     * @throws MessageStateConflict
     * @throws AnswerImpossible
     */
    public function handle(ReplyToMessageCommand $command): string
    {
        $parent = Message::visibleById($command->messageId);

        if ($parent->message_type->isChat()) {
            $reply = new ReplyInChatCommand($parent->id, $command->body, $this->requestKey());

            return $this->chats->reply($reply->withDispatcher($command->dispatchedBy()));
        }

        $membership = $this->reading->recipientOf($command->messageId, $command->dispatchedBy());
        $original = Message::lockedById($command->messageId);

        if ($command->expectedStateVersion !== null && ! $original->isAtStateVersion($command->expectedStateVersion)) {
            throw MessageStateConflict::staleVersion($original->id, $command->expectedStateVersion);
        }

        if ($original->isDismissed()) {
            throw AnswerImpossible::forMessage($original->id);
        }

        $now = CarbonImmutable::now();
        $original->acknowledge($membership, $now);
        $reply = $this->sending->reply($original, $command->body, $command->dispatchedBy());

        if ($original->needsReply()) {
            $this->answers->answer($original, $reply, ActorIdentity::of($command->dispatchedBy()), $now);
        }

        return $reply->id;
    }

    /**
     * The chat request key a desk reply carries into a chat: the key of the request itself, or a fresh one.
     */
    private function requestKey(): string
    {
        return $this->key->key() ?? (string) Str::ulid();
    }
}
