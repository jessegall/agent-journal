<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Communication\Commands\DismissMessage;
use App\Communication\Events\MessageDismissed;
use App\Communication\Models\Message;
use App\Contracts\CommandHandler;
use App\Hooks\Contracts\StackCleanup;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Dismisses the message under its row lock and tells listeners once that has committed.
 */
final readonly class DismissMessageHandler implements CommandHandler
{
    public function __construct(
        private Dispatcher $events,
        private StackCleanup $cleanup,
    ) {}

    public function handle(DismissMessage $command): void
    {
        $this->cleanup->endWork(Message::lockedById($command->messageId), fn (Message $message) => $message->dismiss());
        $this->events->dispatch(new MessageDismissed($command->messageId));
    }
}
