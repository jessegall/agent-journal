<?php

declare(strict_types=1);

namespace App\Commands\Questions\AnswerQuestion;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Exceptions\QuestionRefused;
use App\Exceptions\InboxUnavailable;
use App\Models\Inboxes\InboxMember;
use App\Models\Questions\Question;
use App\Support\ActorIdentity;

/**
 * Only the target, still attached to the inbox, answers, and only once; the question's row is locked while it does.
 */
final readonly class AnswerQuestionHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    /**
     * @throws InboxUnavailable
     * @throws QuestionRefused
     */
    public function handle(AnswerQuestionCommand $command): null
    {
        $answerer = ActorIdentity::of($command->dispatchedBy());
        $question = Question::lockedById($command->questionId);

        if (! InboxMember::isAttached($question->inbox_id, $answerer)) {
            throw InboxUnavailable::forActor($question->inbox_id);
        }

        $question->answer($answerer, trim($command->answer), $this->clock->now());

        return null;
    }
}
