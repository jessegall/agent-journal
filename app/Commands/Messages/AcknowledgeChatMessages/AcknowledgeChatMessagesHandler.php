<?php

declare(strict_types=1);

namespace App\Commands\Messages\AcknowledgeChatMessages;

use App\Contracts\Bus\CommandHandler;
use App\Data\Messages\MessageReadBatch;
use App\Exceptions\MessageMissing;
use App\Support\MessageService;

final readonly class AcknowledgeChatMessagesHandler implements CommandHandler
{
    public function __construct(private MessageService $messages) {}

    /**
     * @throws MessageMissing
     */
    public function handle(AcknowledgeChatMessagesCommand $command): MessageReadBatch
    {
        return $this->messages->readInInbox($command->inboxId, $command->dispatchedBy(), $command->messageIds);
    }
}
