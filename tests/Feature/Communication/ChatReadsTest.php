<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\AcknowledgeChatMessages;
use App\Communication\Commands\PostChatMessage;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Exceptions\ChatInboxRefused;
use App\Communication\Support\PendingInboxWork;
use Domain\Chat\Models\Conversation;
use Tests\Support\MessagingTestCase;
use Tests\Support\OpensPairChats;

/**
 * Chat reads go through the reader's own receipts: the author's own post is no unread item, a wake is no read, an
 * acknowledgement drops only the reader's count, and desk-only reads refuse a chat inbox.
 */
final class ChatReadsTest extends MessagingTestCase
{
    use OpensPairChats;

    private Conversation $chat;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chat = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder));
    }

    public function test_the_authors_own_post_is_not_unread_and_the_agent_stays_unread_until_it_acknowledges(): void
    {
        $this->asOwner();
        $messageId = $this->runOnBus(new PostChatMessage($this->chat->inbox_id, 'Hello.', 'hello-key'));
        $pending = $this->app->make(PendingInboxWork::class);

        $this->assertSame(0, $this->resolver()->counts($this->chat->inbox_id)->unread);
        $this->assertSame(1, $pending->pendingCount($this->actorOf($this->builder)));

        $this->asAgent($this->builder);
        $this->assertSame(1, $this->resolver()->counts($this->chat->inbox_id)->unread);

        $this->runOnBus(new AcknowledgeChatMessages($this->chat->inbox_id, [$messageId]));

        $this->assertSame(0, $this->resolver()->counts($this->chat->inbox_id)->unread);
        $this->assertSame(0, $pending->pendingCount($this->actorOf($this->builder)));
        $this->assertSame([$messageId], array_column(
            $this->resolver()->timeline($this->chat->inbox_id, null, 50)->messages,
            'id',
        ));
    }

    public function test_desk_only_reads_refuse_a_chat_inbox(): void
    {
        $this->asOwner();

        $this->expectException(ChatInboxRefused::class);
        $this->resolver()->between($this->ownerInboxId(), $this->chat->inbox_id, null, 10);
    }

    private function resolver(): ConversationResolver
    {
        $this->app->forgetScopedInstances();

        return $this->app->make(ConversationResolver::class);
    }
}
