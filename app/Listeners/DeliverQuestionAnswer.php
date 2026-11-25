<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\Questions\QuestionAnswered;
use App\Models\Agents\AgentSession;
use App\Models\Questions\Question;
use App\Models\Questions\QuestionAnswerNotice;
use App\Support\QuestionAnswerNotices;

/**
 * An answer to an agent's question writes the agent's notice in the answer's transaction, and hands it to the agent's
 * running session at once; an agent with none running gets it at its next session start.
 */
#[InCommandTransaction]
final readonly class DeliverQuestionAnswer implements Listener
{
    public function __construct(private QuestionAnswerNotices $notices) {}

    public function handle(QuestionAnswered $event): void
    {
        $question = Question::query()->findOrFail($event->questionId);
        $sender = $question->sender;

        if (! $sender->isAgent()) {
            return;
        }

        $notice = QuestionAnswerNotice::write($question, $sender->id);
        $session = AgentSession::liveOf($sender->id);

        if ($session !== null) {
            $this->notices->deliver($notice, $session->id);
        }
    }
}
