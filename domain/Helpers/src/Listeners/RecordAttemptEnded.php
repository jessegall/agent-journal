<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Contracts\Bus\JournalCommands;
use App\Contracts\Events\Listener;
use App\Enums\Accounts\CommandEntry;
use App\Events\Sessions\LaunchEnded;
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
