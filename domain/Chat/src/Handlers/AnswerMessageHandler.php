<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use App\Contracts\CommandHandler;
use App\Hooks\Contracts\StackCleanup;
use Domain\Chat\Api\Events\MessageAnswered;
use Domain\Chat\Commands\AnswerMessage;
use Domain\Chat\Models\Message;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Marks the message answered under its row lock and tells listeners once that has committed.
 */
final readonly class AnswerMessageHandler implements CommandHandler
{
    public function __construct(
        private Dispatcher $events,
        private StackCleanup $cleanup,
    ) {}

    public function handle(AnswerMessage $command): void
    {
        $this->cleanup->endWork(Message::lockedById($command->messageId), fn (Message $message) => $message->markAnswered());
        $this->events->dispatch(new MessageAnswered($command->messageId));
    }
}
