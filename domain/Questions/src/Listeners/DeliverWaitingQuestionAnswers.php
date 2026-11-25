<?php

declare(strict_types=1);

namespace Domain\Questions\Listeners;

use App\Contracts\Bus\JournalCommands;
use App\Contracts\Events\Listener;
use App\Enums\Accounts\CommandEntry;
use App\Events\Sessions\SessionOpened;
use Domain\Questions\Commands\DeliverWaitingQuestionAnswers\DeliverWaitingQuestionAnswersCommand;

/**
 * A session that opens gets the notices of answers that came while its agent ran none, a page at a time.
 */
final readonly class DeliverWaitingQuestionAnswers implements Listener
{
    private const string TRUSTED_ENTRY = 'opened session';

    public function __construct(private JournalCommands $journal) {}

    public function handle(SessionOpened $event): void
    {
        do {
            $delivered = $this->journal->runAsJournal(
                CommandEntry::EngineMaintenance,
                self::TRUSTED_ENTRY,
                new DeliverWaitingQuestionAnswersCommand($event->agentId),
            );
        } while ($delivered === DeliverWaitingQuestionAnswersCommand::BATCH);
    }
}
