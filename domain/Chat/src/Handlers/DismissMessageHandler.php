<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use App\Hooks\Contracts\StackCleanup;
use Domain\Chat\Api\Events\MessageDismissed;
use Domain\Chat\Commands\DismissMessage;
use Domain\Chat\Models\Message;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Dismisses the message under its row lock and tells listeners once that has committed.
 */
final readonly class DismissMessageHandler
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
