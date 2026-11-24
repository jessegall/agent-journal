<?php

declare(strict_types=1);

namespace App\Commands\Messages\ReadMessages;

use App\Contracts\Bus\CommandHandler;
use App\Data\Messages\MessageReadBatch;
use App\Exceptions\MessageMissing;
use App\Support\MessageService;

final readonly class ReadMessagesHandler implements CommandHandler
{
    public function __construct(private MessageService $messages) {}

    /**
     * @throws MessageMissing
     */
    public function handle(ReadMessagesCommand $command): MessageReadBatch
    {
        return $this->messages->readInInbox($command->inboxId, $command->dispatchedBy(), $command->messageIds);
    }
}
