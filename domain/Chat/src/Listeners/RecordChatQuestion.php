<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Events\Listener;
use App\Events\Questions\QuestionAsked;
use App\Models\Questions\Question;
use Domain\Chat\Commands\CreateChatMessage\CreateChatMessageCommand;
use Domain\Chat\Enums\ChatMessageType;

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
            Question::LINK_TYPE,
            $event->questionId,
            ChatMessageType::Question,
        ));
    }
}
