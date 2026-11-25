<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Contracts\Bus\JournalCommands;
use App\Contracts\Events\Listener;
use App\Enums\Accounts\CommandEntry;
use App\Events\Hooks\HelperStopHeld;
use Domain\Helpers\Commands\HoldHelperJob\HoldHelperJobCommand;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Support\HelperLifecycleEntry;
use Domain\Helpers\Support\JobStopEvidence;

/**
 * Holds a helper job for repair once its helper failed its final checks the same way three times, through its own
 * command, run by the journal after the hold committed.
 */
final readonly class HoldFailingJob implements Listener
{
    public function __construct(private JournalCommands $journal) {}

    public function handle(HelperStopHeld $event): void
    {
        if ($event->work->type !== HelperJob::linkType()) {
            return;
        }

        $this->journal->runAsJournal(
            CommandEntry::Application,
            HelperLifecycleEntry::NAME,
            new HoldHelperJobCommand($event->work->id, JobStopEvidence::referenceOf($event->attempt)),
        );
    }
}
