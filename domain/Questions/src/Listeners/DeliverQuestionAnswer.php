<?php

declare(strict_types=1);

namespace Domain\Questions\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\JournalCommands;
use App\Contracts\Events\Listener;
use Domain\Questions\Commands\DeliverWaitingQuestionAnswers\DeliverWaitingQuestionAnswersCommand;
use Domain\Questions\Events\QuestionAnswered;
use Domain\Questions\Models\Question;

/**
 * Once an answer to an agent's question is committed, its notice goes to the agent's running session at once; an
 * agent with none running gets it at its next session start.
 */
final readonly class DeliverQuestionAnswer implements Listener
{
    private const string TRUSTED_ENTRY = 'answered question';

    public function __construct(private JournalCommands $journal) {}

    public function handle(QuestionAnswered $event): void
    {
        $sender = Question::query()->findOrFail($event->questionId)->sender;

        if ($sender->isAgent()) {
            $this->journal->runAsJournal(
                CommandEntry::EngineMaintenance,
                self::TRUSTED_ENTRY,
                new DeliverWaitingQuestionAnswersCommand($sender->id),
            );
        }
    }
}
