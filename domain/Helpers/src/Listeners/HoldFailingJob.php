<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Bus\Contracts\JournalCommands;
use App\Bus\Enums\CommandEntry;
use App\Contracts\Listener;
use App\Hooks\Events\HelperStopHeld;
use Domain\Helpers\Commands\HoldHelperJob;
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
        if ($event->work->type !== HelperJob::LINK_TYPE) {
            return;
        }

        $this->journal->runAsJournal(
            CommandEntry::Application,
            HelperLifecycleEntry::NAME,
            new HoldHelperJob($event->work->id, JobStopEvidence::referenceOf($event->attempt)),
        );
    }
}
