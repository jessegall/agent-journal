<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\ReplyToMessage;
use App\Communication\Events\MessageAnswered;
use App\Communication\Exceptions\AnswerImpossible;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Exceptions\MessageStateConflict;
use App\Communication\Models\Message;
use App\Communication\Support\MessageClaims;
use App\Communication\Support\MessageReading;
use App\Communication\Support\MessageSending;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Events\Dispatcher;

final readonly class ReplyToMessageHandler implements CommandHandler
{
    public function __construct(
        private MessageReading $reading,
        private MessageSending $sending,
        private MessageClaims $claims,
        private Dispatcher $events,
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
        $destinationId = Message::query()->whereKey($command->messageId)->value('destination_inbox_id')
            ?? throw MessageMissing::forId($command->messageId);
        [, $membership] = $this->reading->admit((string) $destinationId, $command->dispatchedBy());
        $original = Message::lockedById($command->messageId);
        $original->requireStateVersion($command->expectedStateVersion);
        $original->requireOpenForReplies();
        $now = CarbonImmutable::now();
        $original->acknowledge($membership, $now);
        $reply = $this->sending->reply($original, $command->body, $command->dispatchedBy());

        if ($original->needsReply()) {
            $answeredBy = ActorIdentity::of($command->dispatchedBy());
            $original->answerWith($reply, $answeredBy, $now);
            $this->claims->releaseAny($original);
            $this->events->dispatch(new MessageAnswered($original->id, $reply->id, $answeredBy));
        }

        return $reply->id;
    }
}
