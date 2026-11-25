<?php

declare(strict_types=1);

namespace App\Commands\Questions\AskQuestion;

use App\Attributes\RepeatableRead;
use App\Attributes\RetainedActorRequestKey;
use App\Enums\Questions\QuestionType;
use App\Support\ActorIdentity;
use App\Support\Command;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Asks an actor attached to the inbox a question, open or a choice between options; returns the question's id.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
final readonly class AskQuestionCommand extends Command
{
    /**
     * @param  list<string>  $options
     */
    public function __construct(
        public string $inboxId,
        public ActorIdentity $target,
        #[Required]
        public string $text,
        public QuestionType $type,
        public array $options = [],
    ) {}
}
