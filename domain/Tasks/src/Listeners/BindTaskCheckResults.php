<?php

declare(strict_types=1);

namespace Domain\Tasks\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\JournalCommands;
use App\Bus\Contracts\ResultReceipts;
use App\Contracts\Events\Listener;
use App\Events\Processes\RunChanged;
use App\Processes\Values\PartProjection;
use Domain\Tasks\Commands\BindTaskCheck\BindTaskCheckCommand;
use Domain\Tasks\Models\TaskCheck;

/**
 * Hears a process run's committed change and, when a part of it has a current result receipt and the run is a task
 * check not yet bound, has the journal bind that receipt through Tasks' own command. A run no check names, or a part
 * without a receipt, binds nothing; a replay finds the check bound and changes nothing.
 */
final readonly class BindTaskCheckResults implements Listener
{
    public const string ENTRY = 'task checks';

    public function __construct(
        private ResultReceipts $receipts,
        private JournalCommands $journal,
    ) {}

    public function handle(RunChanged $event): void
    {
        $check = TaskCheck::findForProcessRun($event->runId);

        if ($check === null || $check->isBound()) {
            return;
        }

        foreach ($event->parts as $part) {
            $this->bindPart($part);
        }
    }

    private function bindPart(PartProjection $part): void
    {
        $result = $this->receipts->forPart($part->partRunId)->getOrElse(null);

        if ($result === null) {
            return;
        }

        $this->journal->runAsJournal(
            CommandEntry::Application,
            self::ENTRY,
            new BindTaskCheckCommand($result->receiptId),
        );
    }
}
