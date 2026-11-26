<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Bus\Contracts\CommandBus;
use App\Contracts\Events\Listener;
use Domain\Chat\Commands\CreateChatMessage\CreateChatMessageCommand;
use Domain\Chat\Enums\ChatMessageType;
use Domain\Questions\Events\QuestionAsked;
use Domain\Questions\Values\QuestionNotificationKeys;

/**
 * Every question asked in an inbox shows in its chat as a question card.
 */
#[InCommandTransaction]
final readonly class RecordChatQuestion implements Listener
{
    public function __construct(private CommandBus $commands) {}

    public function handle(QuestionAsked $event): void
    {
        $this->commands->run(new CreateChatMessageCommand(
            $event->inboxId,
            QuestionNotificationKeys::target(),
            $event->questionId,
            ChatMessageType::Question,
        ));
    }
}
