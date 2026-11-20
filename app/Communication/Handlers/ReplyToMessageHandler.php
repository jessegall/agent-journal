<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\ReplyToMessage;
use App\Communication\Exceptions\AnswerImpossible;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Exceptions\MessageStateConflict;
use App\Communication\Models\Message;
use App\Communication\Support\MessageAnswers;
use App\Communication\Support\MessageReading;
use App\Communication\Support\MessageSending;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;

final readonly class ReplyToMessageHandler implements CommandHandler
{
    public function __construct(
        private MessageReading $reading,
        private MessageSending $sending,
        private MessageAnswers $answers,
    ) {}

    /**
     * Any member of the destination inbox may answer, not only the first reader; answering a waiting message closes
     * it and ends its claim, and a reply to an answered one is a follow-up.
     *
     * @throws MessageMissing
     * @throws MessageStateConflict
     * @throws AnswerImpossible
     */
    public function handle(ReplyToMessage $command): string
    {
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
}
