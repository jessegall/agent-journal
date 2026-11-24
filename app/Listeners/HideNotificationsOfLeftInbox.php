<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Commands\Notifications\HideLeftInboxNotifications\HideLeftInboxNotificationsCommand;
use App\Contracts\Bus\JournalCommands;
use App\Contracts\Events\Listener;
use App\Enums\CommandEntry;
use App\Events\Inboxes\InboxLeft;

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
                new HideLeftInboxNotificationsCommand($event->actor->type->value, $event->actor->id, $event->inboxId),
            );
        } while ($hidden === HideLeftInboxNotificationsCommand::BATCH);
    }
}
