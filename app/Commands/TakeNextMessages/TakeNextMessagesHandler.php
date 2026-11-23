<?php

declare(strict_types=1);

namespace App\Commands\TakeNextMessages;

use App\Contracts\Bus\CommandHandler;
use App\Data\MessageReadBatch;
use App\Models\Messages\Message;
use App\Support\MessageService;

final readonly class TakeNextMessagesHandler implements CommandHandler
{
    public function __construct(private MessageService $messages) {}

    public function handle(TakeNextMessagesCommand $command): MessageReadBatch
    {
        [$inbox, $membership] = $this->messages->admit($command->inboxId, $command->dispatchedBy());
        $limit = max(1, min($command->limit, TakeNextMessagesCommand::LARGEST_LIMIT));

        $candidates = Message::query()
            ->waitingForTakeUp($inbox->inboxId(), TakeNextMessagesCommand::LARGEST_LIMIT)
            ->get()
            ->all();

        $held = $this->messages->heldIds(array_values(array_map(fn (Message $message) => $message->id, $candidates)));

        $free = array_slice(
            array_values(array_filter($candidates, fn (Message $message) => ! in_array($message->id, $held, true))),
            0,
            $limit,
        );

        return $this->messages->read($membership, $free);
    }
}
