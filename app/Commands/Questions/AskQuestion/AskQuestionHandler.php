<?php

declare(strict_types=1);

namespace App\Commands\Questions\AskQuestion;

use App\Contracts\Actors\ActorResolver;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Questions\AnswersQuestions;
use App\Enums\Questions\QuestionType;
use App\Exceptions\InboxUnavailable;
use App\Exceptions\QuestionRefused;
use App\Models\Inboxes\InboxMember;
use App\Models\Questions\Question;
use App\Support\ActorIdentity;

/**
 * The sender and the target are both attached to the inbox, the target can answer questions, and the options fit the
 * question's type.
 */
final readonly class AskQuestionHandler implements CommandHandler
{
    public function __construct(private ActorResolver $actors) {}

    /**
     * @throws InboxUnavailable
     * @throws QuestionRefused
     */
    public function handle(AskQuestionCommand $command): string
    {
        $sender = ActorIdentity::of($command->dispatchedBy());

        if (! InboxMember::isAttached($command->inboxId, $sender)) {
            throw InboxUnavailable::forActor($command->inboxId);
        }

        if (! $this->actors->get($command->target) instanceof AnswersQuestions) {
            throw QuestionRefused::targetCannotAnswer($command->target);
        }

        if (! InboxMember::isAttached($command->inboxId, $command->target)) {
            throw QuestionRefused::targetNotInInbox($command->target);
        }

        $options = array_map(trim(...), $command->options);

        if ($command->type === QuestionType::Open && $options !== []) {
            throw QuestionRefused::openTakesNoOptions();
        }

        $isEveryOptionUsable = count($options) >= 2
            && count(array_unique($options)) === count($options)
            && ! in_array('', $options, true);

        if ($command->type === QuestionType::Choice && ! $isEveryOptionUsable) {
            throw QuestionRefused::choiceNeedsOptions();
        }

        return Question::create($command->inboxId, $sender, $command->target, $command->text, $command->type, $options)->id;
    }
}
