<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Communication\Contracts\InboxNotices;
use App\Communication\Enums\MessageType;
use App\Communication\Models\Message;
use App\Desks\Commands\InstallDesks;
use Tests\Support\MessagingTestCase;

/**
 * A journal notice is desk mail: it goes from the system inbox to the owner's own inbox, so the messages table's
 * shape check by type lets it through.
 */
final class JournalNoticeDeskRowTest extends MessagingTestCase
{
    public function test_a_journal_notice_to_the_owner_is_stored_as_a_desk_row(): void
    {
        $this->app->make(EntryDispatchers::class)
            ->runAsJournal(CommandEntry::HostControl, 'desk install', new InstallDesks());

        $ownerInboxId = $this->ownerInboxId();
        $messageId = $this->app->make(InboxNotices::class)->sendFromJournal(null, 'A draft was kept.', 'notice-1');

        $message = Message::query()->acrossInboxes()->findOrFail($messageId);

        $this->assertSame(MessageType::Desk, $message->message_type);
        $this->assertSame($ownerInboxId, $message->destination_inbox_id);
        $this->assertNotSame($message->source_inbox_id, $message->destination_inbox_id);
        $this->assertNull($message->timeline_event_id);
    }
}
