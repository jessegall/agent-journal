<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

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
    ) {}

    public function handle(DismissMessage $command): void
    {
        Message::lockedById($command->messageId)->dismiss();
        $this->events->dispatch(new MessageDismissed($command->messageId));
    }
}
