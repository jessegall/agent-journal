<?php

declare(strict_types=1);

namespace App\Commands\Questions\ReadQuestion;

use App\Contracts\Bus\CommandHandler;
use App\Support\ShownQuestion;
use App\Exceptions\QuestionRefused;
use App\Models\Questions\Question;
use App\Support\ActorIdentity;

/**
 * Only the question's sender and its target read it.
 */
final readonly class ReadQuestionHandler implements CommandHandler
{
    /**
     * @throws QuestionRefused
     */
    public function handle(ReadQuestionCommand $command): ShownQuestion
    {
        $reader = ActorIdentity::of($command->dispatchedBy());
        $question = Question::query()->findOrFail($command->questionId);

        if (! $question->sender()->isSameAs($reader) && ! $question->target()->isSameAs($reader)) {
            throw QuestionRefused::notInvolved($question->id);
        }

        return ShownQuestion::of($question);
    }
}
