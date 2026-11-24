<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\AskMessage\AskMessageCommand;
use App\Commands\ReadMessages\ReadMessagesCommand;
use App\Commands\ReplyToMessage\ReplyToMessageCommand;
use App\Contracts\Chat\ConversationResolver;
use App\Data\Messages\MessageView;
use Illuminate\Support\Facades\DB;
use Tests\Support\MessagingTestCase;

/**
 * A conversation row tells its own sender the request key it went under, so a pending send settles on it; every
 * other viewer, and every row an agent wrote, reads no key.
 */
final class MessageRequestKeyTest extends MessagingTestCase
{
    public function test_the_sender_reads_its_key_and_another_viewer_reads_none(): void
    {
        $questionId = $this->runOnBus(
            new AskMessageCommand($this->ownerInboxId(), $this->inboxIdOf($this->builder), 'Which port?'),
            'owner-key-1',
        );

        $this->assertSame('owner-key-1', $this->rowOf($this->ownerInboxId(), $questionId)->requestKey);
        $this->asAgent($this->builder);
        $this->assertNull($this->rowOf($this->inboxIdOf($this->builder), $questionId)->requestKey);
    }

    public function test_a_row_an_agent_wrote_has_no_key_for_the_owner(): void
    {
        $questionId = $this->ownerAsks($this->inboxIdOf($this->builder), 'Which port?');
        $this->asAgent($this->builder);
        $this->runOnBus(new ReadMessagesCommand($this->inboxIdOf($this->builder), [$questionId]));
        $replyId = $this->runOnBus(new ReplyToMessageCommand($questionId, null, 'Port 8080.'), 'agent-key-1');
        $this->asOwner();

        $this->assertNull($this->rowOf($this->ownerInboxId(), $replyId)->requestKey);
    }

    public function test_the_keys_of_a_conversation_are_read_in_one_query_whatever_its_length(): void
    {
        foreach (range(1, 3) as $count) {
            $this->runOnBus(
                new AskMessageCommand($this->ownerInboxId(), $this->inboxIdOf($this->builder), "Question {$count}"),
                "owner-key-{$count}",
            );
        }

        $receiptReads = 0;
        DB::listen(function ($query) use (&$receiptReads): void {
            $receiptReads += str_contains($query->sql, 'command_receipts') ? 1 : 0;
        });
        $rows = $this->conversations()->history($this->ownerInboxId(), null, 50)->messages;

        // The history lists a conversation oldest first; readableKeysOf only keys each row's receipt by id.
        $this->assertSame(['owner-key-1', 'owner-key-2', 'owner-key-3'], array_map(
            fn (MessageView $row) => $row->requestKey,
            array_values(array_filter($rows, fn (MessageView $row) => $row->requestKey !== null)),
        ));
        $this->assertSame(1, $receiptReads);
    }

    private function rowOf(string $inboxId, string $messageId): MessageView
    {
        $rows = array_filter(
            $this->conversations()->history($inboxId, null, 50)->messages,
            fn (MessageView $row) => $row->id === $messageId,
        );

        return array_values($rows)[0];
    }

    private function conversations(): ConversationResolver
    {
        return $this->app->make(ConversationResolver::class);
    }
}
