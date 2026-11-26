<?php

declare(strict_types=1);

namespace Tests\Commands\Messages;

use App\Exceptions\InboxUnavailable;
use App\Messages\Commands\ReadMessage\ReadMessageCommand;
use App\Models\Messages\MessageReadEntry;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A member reads a message of an inbox it is attached to and the read is kept; a message of an inbox it is not
 * attached to is refused and nothing is kept.
 */
#[TestsCommand(ReadMessageCommand::class)]
final class ReadMessageTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['messages', 'message_reads'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Planner')->agent('Stranger')->sharedInbox('Owner', 'Planner');
    }

    public function test_a_member_reads_the_message_and_the_read_is_kept(): void
    {
        $message = $this->journal->post('Owner', $this->journal->sharedInboxOf('Owner', 'Planner'), 'Start the build.');

        $shown = $this->journal->actAs('Planner')->run(new ReadMessageCommand($message->id));

        $this->assertSame($message->id, $shown->id);
        $entry = MessageReadEntry::query()->sole();
        $this->assertSame(
            [$message->id, $this->journal->agentCalled('Planner')->id],
            [$entry->message_id, $entry->reader_id],
        );
    }

    public function test_a_message_of_an_inbox_the_reader_is_not_in_is_refused(): void
    {
        $message = $this->journal->post('Owner', $this->journal->sharedInboxOf('Owner', 'Planner'), 'Start the build.');

        $this->assertThrows(
            fn () => $this->journal->actAs('Stranger')->run(new ReadMessageCommand($message->id)),
            InboxUnavailable::class,
        );
        $this->assertSame(0, MessageReadEntry::query()->count());
    }
}
