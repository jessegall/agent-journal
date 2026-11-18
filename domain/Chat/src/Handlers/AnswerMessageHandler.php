<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use Domain\Chat\Api\Events\MessageAnswered;
use Domain\Chat\Commands\AnswerMessage;
use Domain\Chat\Models\Message;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Marks the message answered under its row lock and tells listeners once that has committed.
 */
final readonly class AnswerMessageHandler
{
    public function __construct(
        private Dispatcher $events,
    ) {}

    public function handle(AnswerMessage $command): void
    {
        Message::lockedById($command->messageId)->markAnswered();
        $this->events->dispatch(new MessageAnswered($command->messageId));
    }
}
