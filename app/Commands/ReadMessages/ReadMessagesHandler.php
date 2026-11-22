<?php

declare(strict_types=1);

namespace App\Commands\ReadMessages;

use App\Contracts\Bus\CommandHandler;
use App\Data\MessageReadBatch;
use App\Exceptions\MessageMissing;
use App\Support\MessageReading;

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
