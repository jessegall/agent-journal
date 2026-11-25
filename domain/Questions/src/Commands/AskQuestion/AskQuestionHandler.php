<?php

declare(strict_types=1);

namespace Domain\Questions\Commands\AskQuestion;

use App\Contracts\Actors\ActorResolver;
use App\Contracts\Questions\QuestionRecipient;
use App\Exceptions\InboxUnavailable;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
use Domain\Questions\Commands\Support\QuestionCommandHandler;
use Domain\Questions\Enums\QuestionType;
use Domain\Questions\Exceptions\QuestionRefused;
use Domain\Questions\Models\Question;

/**
 * The sender and the target are both attached to the inbox, the target can answer questions, and the options fit the
 * question's type.
 */
final readonly class AskQuestionHandler extends QuestionCommandHandler
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

        if (! $this->actors->get($command->target) instanceof QuestionRecipient) {
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
