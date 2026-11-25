<?php

declare(strict_types=1);

namespace Domain\Questions\Commands\ReadQuestion;

use App\Support\ActorIdentity;
use Domain\Questions\Commands\Support\QuestionCommandHandler;
use Domain\Questions\Exceptions\QuestionRefused;
use Domain\Questions\Models\Question;
use Domain\Questions\Support\ShownQuestion;

/**
 * Only the question's sender and its target read it.
 */
final readonly class ReadQuestionHandler extends QuestionCommandHandler
{
    /**
     * @throws QuestionRefused
     */
    public function handle(ReadQuestionCommand $command): ShownQuestion
    {
        $reader = ActorIdentity::of($command->dispatchedBy());
        $question = Question::query()->findOrFail($command->questionId);

        if (! $question->sender->isSameAs($reader) && ! $question->target->isSameAs($reader)) {
            throw QuestionRefused::notInvolved($question->id);
        }

        return $question->shown;
    }
}
