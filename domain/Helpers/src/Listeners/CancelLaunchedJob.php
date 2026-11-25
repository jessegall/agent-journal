<?php

declare(strict_types=1);

namespace Domain\Helpers\Listeners;

use App\Contracts\Bus\JournalCommands;
use App\Contracts\Events\Listener;
use App\Enums\Accounts\CommandEntry;
use App\Events\Sessions\SessionStartCancelled;
use Domain\Helpers\Commands\CancelLaunchedHelperJob\CancelLaunchedHelperJobCommand;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Support\HelperLifecycleEntry;

/**
 * Cancels a helper job whose launch Core cancelled, through its own command, run by the journal after the
 * cancellation committed.
 */
final readonly class CancelLaunchedJob implements Listener
{
    public function __construct(private JournalCommands $journal) {}

    public function handle(SessionStartCancelled $event): void
    {
        if ($event->work->type !== HelperJob::linkType()) {
            return;
        }

        $this->journal->runAsJournal(
            CommandEntry::Application,
            HelperLifecycleEntry::NAME,
            new CancelLaunchedHelperJobCommand($event->work->id),
        );
    }
}
