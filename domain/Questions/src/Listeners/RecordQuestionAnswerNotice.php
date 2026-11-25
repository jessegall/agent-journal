<?php

declare(strict_types=1);

namespace Domain\Questions\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use Domain\Questions\Events\QuestionAnswered;
use Domain\Questions\Models\Question;
use Domain\Questions\Models\QuestionAnswerNotice;

/**
 * An answer to an agent's question writes the agent's notice in the answer's transaction, so an answer is never kept
 * without the notice that tells the agent of it.
 */
#[InCommandTransaction]
final readonly class RecordQuestionAnswerNotice implements Listener
{
    public function handle(QuestionAnswered $event): void
    {
        $question = Question::query()->findOrFail($event->questionId);
        $sender = $question->sender;

        if ($sender->isAgent()) {
            QuestionAnswerNotice::create($question, $sender);
        }
    }
}
