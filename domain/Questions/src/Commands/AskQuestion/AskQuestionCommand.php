<?php

declare(strict_types=1);

namespace Domain\Questions\Commands\AskQuestion;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RepeatableRead;
use App\Attributes\Commands\RetainedActorRequestKey;
use App\Enums\Agents\AccessType;
use App\Policies\MessagePolicy;
use App\Support\ActorReference;
use App\Support\Command;
use Domain\Questions\Enums\QuestionType;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Asks an actor attached to the inbox a question, open or a choice between options; returns the question's id.
 *
 * @extends Command<string>
 */
#[Authorize(MessagePolicy::class, AccessType::Create)]
#[RepeatableRead]
#[RetainedActorRequestKey]
final readonly class AskQuestionCommand extends Command
{
    /**
     * @param  list<string>  $options
     */
    public function __construct(
        public string $inboxId,
        public ActorReference $target,
        #[Required]
        public string $text,
        public QuestionType $type,
        public array $options = [],
    ) {}
}
