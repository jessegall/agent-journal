<?php

declare(strict_types=1);

namespace Domain\Questions\Listeners;

use App\Contracts\Bus\JournalCommands;
use App\Contracts\Events\Listener;
use App\Enums\Accounts\CommandEntry;
use App\Events\Inboxes\InboxLeft;
use Domain\Questions\Commands\HideLeftInboxNotifications\HideLeftInboxNotificationsCommand;

/**
 * An actor that left an inbox no longer sees the notifications of questions asked of it there.
 */
final readonly class HideNotificationsOfLeftInbox implements Listener
{
    private const string TRUSTED_ENTRY = 'left inbox';

    public function __construct(private JournalCommands $journal) {}

    public function handle(InboxLeft $event): void
    {
        do {
            $hidden = $this->journal->runAsJournal(
                CommandEntry::EngineMaintenance,
                self::TRUSTED_ENTRY,
                new HideLeftInboxNotificationsCommand($event->actor->type, $event->actor->id, $event->inboxId),
            );
        } while ($hidden === HideLeftInboxNotificationsCommand::BATCH);
    }
}
