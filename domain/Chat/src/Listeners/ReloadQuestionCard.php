<?php

declare(strict_types=1);

namespace Domain\Chat\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\Questions\QuestionAnswered;
use Domain\Chat\Models\ChatMessage;

/**
 * An answered question's card keeps its place and is read again, with the answer.
 */
#[InCommandTransaction]
final readonly class ReloadQuestionCard implements Listener
{
    public function handle(QuestionAnswered $event): void
    {
        if (! $card = ChatMessage::findForQuestion($event->questionId)) {
            return;
        }

        $card->reload();
    }
}
