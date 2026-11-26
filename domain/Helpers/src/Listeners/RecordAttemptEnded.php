<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\JournalCommands;
use App\Contracts\Events\Listener;
use App\Events\Sessions\SessionStartEnded;
use Domain\Helpers\Commands\MarkHelperJobUnfinished\MarkHelperJobUnfinishedCommand;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Support\HelperLifecycleEntry;

/**
 * Marks a helper job unfinished once its helper's start ended before the job was done, through its own command,
 * run by the journal after the start ended.
 */
final readonly class RecordAttemptEnded implements Listener
{
    public function __construct(private JournalCommands $journal) {}

    public function handle(SessionStartEnded $event): void
    {
        if ($event->work->type !== HelperJob::linkType()) {
            return;
        }

        $this->journal->runAsJournal(
            CommandEntry::Application,
            HelperLifecycleEntry::NAME,
            new MarkHelperJobUnfinishedCommand($event->work->id),
        );
    }
}
