<?php

declare(strict_types=1);

namespace Domain\Questions\Commands\AnswerQuestion;

use App\Contracts\Time\ServerClock;
use App\Exceptions\InboxUnavailable;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
use Domain\Questions\Commands\Support\QuestionCommandHandler;
use Domain\Questions\Exceptions\QuestionRefused;
use Domain\Questions\Models\Question;

/**
 * Only the target, still attached to the inbox, answers, and only once; the question's row is locked while it does.
 */
final readonly class AnswerQuestionHandler extends QuestionCommandHandler
{
    public function __construct(private ServerClock $clock) {}

    /**
     * @throws InboxUnavailable
     * @throws QuestionRefused
     */
    public function handle(AnswerQuestionCommand $command): void
    {
        $answerer = ActorIdentity::of($command->dispatchedBy());
        $question = Question::findLockedById($command->questionId);

        if (! InboxMember::isAttached($question->inbox_id, $answerer)) {
            throw InboxUnavailable::forActor($question->inbox_id);
        }

        $question->answer($answerer, trim($command->answer), $this->clock->now());
    }
}
