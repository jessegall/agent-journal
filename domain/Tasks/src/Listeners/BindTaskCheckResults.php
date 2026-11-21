<?php

declare(strict_types=1);

namespace Domain\Tasks\Listeners;

use App\Bus\Contracts\JournalCommands;
use App\Bus\Enums\CommandEntry;
use App\Contracts\Listener;
use App\Processes\Contracts\ResultReceipts;
use App\Processes\Events\RunChanged;
use App\Processes\Values\PartProjection;
use Domain\Tasks\Commands\BindTaskCheck;
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
        $check = TaskCheck::ofProcessRun($event->runId);

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

        $this->journal->runAsJournal(CommandEntry::Application, self::ENTRY, new BindTaskCheck($result->receiptId));
    }
}
