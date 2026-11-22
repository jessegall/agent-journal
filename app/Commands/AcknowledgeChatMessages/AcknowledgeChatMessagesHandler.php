<?php

declare(strict_types=1);

namespace App\Commands\AcknowledgeChatMessages;

use App\Contracts\CommandHandler;
use App\Data\MessageReadBatch;
use App\Exceptions\MessageMissing;
use App\Support\MessageReading;

final readonly class AcknowledgeChatMessagesHandler implements CommandHandler
{
    public function __construct(private MessageReading $reading) {}

    /**
     * @throws MessageMissing
     */
    public function handle(AcknowledgeChatMessagesCommand $command): MessageReadBatch
    {
        return $this->reading->readInInbox($command->inboxId, $command->dispatchedBy(), $command->messageIds);
    }
}
