<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Contracts\JournalCommands;
use App\Contracts\Listener;
use App\Enums\CommandEntry;
use App\Events\LaunchEnded;
use Domain\Helpers\Commands\MarkHelperJobUnfinished\MarkHelperJobUnfinishedCommand;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Support\HelperLifecycleEntry;

/**
 * Marks a helper job unfinished once its helper's launch ended before the job was done, through its own command,
 * run by the journal after the launch ended.
 */
final readonly class RecordAttemptEnded implements Listener
{
    public function __construct(private JournalCommands $journal) {}

    public function handle(LaunchEnded $event): void
    {
        if ($event->work->type !== HelperJob::LINK_TYPE) {
            return;
        }

        $this->journal->runAsJournal(
            CommandEntry::Application,
            HelperLifecycleEntry::NAME,
            new MarkHelperJobUnfinishedCommand($event->work->id),
        );
    }
}
