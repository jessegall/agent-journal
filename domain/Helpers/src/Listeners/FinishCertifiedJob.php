<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Bus\Contracts\JournalCommands;
use App\Bus\Enums\CommandEntry;
use App\Contracts\Listener;
use App\Hooks\Events\HelperCompletionCertified;
use Domain\Helpers\Commands\FinishHelperJob;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Support\HelperLifecycleEntry;
use Domain\Helpers\Support\JobStopEvidence;

/**
 * Finishes a helper job once Core certifies its helper's stop: its final checks passed, never because the program
 * exited. The job changes through its own command, run by the journal after the certification committed.
 */
final readonly class FinishCertifiedJob implements Listener
{
    public function __construct(private JournalCommands $journal) {}

    public function handle(HelperCompletionCertified $event): void
    {
        if ($event->work->type !== HelperJob::LINK_TYPE) {
            return;
        }

        $this->journal->runAsJournal(
            CommandEntry::Application,
            HelperLifecycleEntry::NAME,
            new FinishHelperJob($event->work->id, JobStopEvidence::referenceOf($event->attempt)),
        );
    }
}
