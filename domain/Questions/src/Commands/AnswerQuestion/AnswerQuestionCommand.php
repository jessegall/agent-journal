<?php

declare(strict_types=1);

namespace Domain\Questions\Commands\AnswerQuestion;

use App\Attributes\Commands\RepeatableRead;
use App\Attributes\Commands\RetainedActorRequestKey;
use App\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Answers a question asked of the actor in hand, once.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
final readonly class AnswerQuestionCommand extends Command
{
    public function __construct(
        public string $questionId,
        #[Required]
        public string $answer,
    ) {}
}
