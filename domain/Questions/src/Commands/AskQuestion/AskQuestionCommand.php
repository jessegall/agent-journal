<?php

declare(strict_types=1);

namespace Domain\Questions\Commands\AskQuestion;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RepeatableRead;
use App\Attributes\Commands\RetainedActorRequestKey;
use App\Contracts\Projects\ProjectCommand;
use App\Enums\Agents\AccessType;
use App\Policies\MessagePolicy;
use App\Support\ActorReference;
use App\Support\Command;
use App\Values\ProjectOwner;
use Domain\Questions\Enums\QuestionType;
use Spatie\LaravelData\Attributes\Validation\Required;

/**
 * Asks an actor attached to the inbox a question of the asker's project, open or a choice between options; returns
 * the question's id.
 *
 * @extends Command<string>
 */
#[RepeatableRead]
#[RetainedActorRequestKey]
#[Authorize(MessagePolicy::class, AccessType::Create)]
final readonly class AskQuestionCommand extends Command implements ProjectCommand
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
        public string $projectId,
        public array $options = [],
    ) {}

    public function owner(): ProjectOwner
    {
        return ProjectOwner::ofProject($this->projectId);
    }
}
