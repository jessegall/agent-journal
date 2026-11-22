<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Bus\Contracts\JournalCommands;
use App\Bus\Enums\CommandEntry;
use App\Contracts\Listener;
use App\Hooks\Contracts\HelperRecordFacts;
use App\Hooks\Events\HelperCompletionCertified;
use App\Records\Support\RecordIdentity;
use Domain\Helpers\Commands\FinishHelperJob\FinishHelperJobCommand;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperPurpose;
use Domain\Helpers\Support\HelperLifecycleEntry;
use Domain\Helpers\Support\JobStopEvidence;

/**
 * Finishes a helper job once Core certifies its helper's stop: its final checks passed, never because the driver
 * exited. The job changes through its own command, run by the journal after the certification committed.
 */
final readonly class FinishCertifiedJob implements Listener
{
    public function __construct(private JournalCommands $journal, private HelperRecordFacts $helperFacts) {}

    public function handle(HelperCompletionCertified $event): void
    {
        if ($event->work->type !== HelperJob::LINK_TYPE) {
            return;
        }

        $this->journal->runAsJournal(
            CommandEntry::Application,
            HelperLifecycleEntry::NAME,
            new FinishHelperJobCommand($event->work->id, JobStopEvidence::referenceOf($event->attempt)),
        );

        $job = HelperJob::query()->whereKey($event->work->id)->first();

        if ($job !== null) {
            $this->tellParent($job);
        }
    }

    /**
     * Tells the parent's states that the helper it sent on a record reported back, once its job is finished.
     */
    private function tellParent(HelperJob $job): void
    {
        $purpose = HelperPurpose::query()->findOrFail($job->helper_purpose_id);
        $helper = HelperIdentity::query()->findOrFail($job->helper_identity_id)->helperActor();

        $purpose->subject_record->forAll(
            fn (RecordIdentity $subject) => $this->helperFacts->reported($job->actor(), $subject, $helper->id),
        );
    }
}
