<?php

declare(strict_types=1);

namespace App\Communication\Commands\TakeNextMessages;

use App\Communication\Data\MessageReadBatch;
use App\Communication\Models\Message;
use App\Communication\Support\MessageReading;
use App\Contracts\CommandHandler;

final readonly class TakeNextMessagesHandler implements CommandHandler
{
    public function __construct(private MessageReading $reading) {}

    public function handle(TakeNextMessagesCommand $command): MessageReadBatch
    {
        [$inbox, $membership] = $this->reading->admit($command->inboxId, $command->dispatchedBy());
        $limit = max(1, min($command->limit, TakeNextMessagesCommand::LARGEST_LIMIT));

        $candidates = Message::query()
            ->waitingForTakeUp($inbox->inboxId(), TakeNextMessagesCommand::LARGEST_LIMIT)
            ->get()
            ->all();

        $held = $this->reading->heldIds(array_values(array_map(fn (Message $message) => $message->id, $candidates)));

        $free = array_slice(
            array_values(array_filter($candidates, fn (Message $message) => ! in_array($message->id, $held, true))),
            0,
            $limit,
        );

        return $this->reading->read($membership, $free);
    }
}
