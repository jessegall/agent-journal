<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Listeners\InCommandTransaction;
use App\Bus\Contracts\JournalCommands;
use App\Contracts\Events\Listener;
use App\Hosts\Commands\RemoveSessionNetwork\RemoveSessionNetworkCommand;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionProcess;
use App\Sessions\Contracts\StartEndEvent;

/**
 * Every end of a start on a contained host, stopped, called off or refused, removes its session's network from the
 * agent daemon once no other start of that session is still live, so a failed start leaves no network behind.
 */
#[InCommandTransaction]
final readonly class RemoveEndedStartNetwork implements Listener
{
    private const string TRUSTED_ENTRY = 'removing what an ended start left';

    public function __construct(private JournalCommands $commands) {}

    public function handle(StartEndEvent $event): void
    {
        $start = SessionProcess::query()->findOrFail($event->startId);

        if ($start->host_id === null || ! Host::query()->findOrFail($start->host_id)->arrangement->isContained()) {
            return;
        }

        if (SessionProcess::query()->ofSessions([$start->session_id])->unresolved()->exists()) {
            return;
        }

        $this->commands->runAsJournal(
            CommandEntry::HostControl,
            self::TRUSTED_ENTRY,
            new RemoveSessionNetworkCommand($start->host_id, $start->session_id),
        );
    }
}
