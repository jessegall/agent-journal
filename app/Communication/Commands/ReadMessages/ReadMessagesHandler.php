<?php

declare(strict_types=1);

namespace App\Communication\Commands\ReadMessages;

use App\Communication\Data\MessageReadBatch;
use App\Communication\Exceptions\MessageMissing;
use App\Communication\Support\MessageReading;
use App\Contracts\CommandHandler;

final readonly class ReadMessagesHandler implements CommandHandler
{
    public function __construct(private MessageReading $reading) {}

    /**
     * @throws MessageMissing
     */
    public function handle(ReadMessagesCommand $command): MessageReadBatch
    {
        return $this->reading->readInInbox($command->inboxId, $command->dispatchedBy(), $command->messageIds);
    }
}
