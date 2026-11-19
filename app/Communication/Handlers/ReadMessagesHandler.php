<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Communication\Commands\ReadMessages;
use App\Communication\Data\MessageReadBatch;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Models\Message;
use App\Communication\Support\MessageReading;
use App\Contracts\CommandHandler;

final readonly class ReadMessagesHandler implements CommandHandler
{
    public function __construct(private MessageReading $reading) {}

    /**
     * @throws MessageMissing
     */
    public function handle(ReadMessages $command): MessageReadBatch
    {
        [$inbox, $membership] = $this->reading->admit($command->inboxId, $command->dispatchedBy());
        $messages = Message::query()
            ->whereKey($command->messageIds)
            ->where('destination_inbox_id', $inbox->inboxId())
            ->lockForUpdate()
            ->readLimit(count($command->messageIds))
            ->get()
            ->keyBy('id');
        $missing = array_diff($command->messageIds, $messages->keys()->all());

        if ($missing !== []) {
            throw MessageMissing::forId((string) reset($missing));
        }

        return $this->reading->read($membership, array_map(fn (string $id) => $messages[$id], $command->messageIds));
    }
}
