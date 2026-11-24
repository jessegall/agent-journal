<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\Messages\ReadMessages\ReadMessagesCommand;
use App\Contracts\Chat\ConversationResolver;
use App\Exceptions\MessageMissing;
use App\Models\Messages\Message;
use Tests\Support\MessagingTestCase;

/**
 * Messages are read in bounded pages, oldest first within a page, with a cursor to the older ones; counts say what
 * waits; detail and wake status answer only those who may see the message.
 */
final class MessageResolversTest extends MessagingTestCase
{
    public function test_a_conversation_pages_back_by_its_cursor(): void
    {
        $sent = array_map(
            fn (string $body) => $this->ownerSends($this->inboxIdOf($this->builder), $body),
            ['One', 'Two', 'Three'],
        );

        $builderInboxId = $this->inboxIdOf($this->builder);
        $newest = $this->resolver()->between($this->ownerInboxId(), $builderInboxId, null, 2);
        $older = $this->resolver()->between($this->ownerInboxId(), $builderInboxId, $newest->olderCursor, 2);
        $history = $this->resolver()->history($this->inboxIdOf($this->builder), null, 50);

        $this->assertSame(['Two', 'Three'], array_map(fn ($view) => $view->body, $newest->messages));
        $this->assertSame(['One'], array_map(fn ($view) => $view->body, $older->messages));
        $this->assertNull($older->olderCursor);
        $this->assertCount(3, $history->messages);
        $this->assertSame($sent[0], $older->messages[0]->id);
    }

    public function test_counts_say_what_is_unread_and_what_waits_with_or_without_a_claim(): void
    {
        $taken = $this->ownerAsks($this->inboxIdOf($this->builder), 'Taken?');
        $this->ownerAsks($this->inboxIdOf($this->builder), 'Waiting?');
        $this->asAgent($this->builder);
        $this->runOnBus(new ReadMessagesCommand($this->inboxIdOf($this->builder), [$taken]));

        $counts = $this->resolver()->counts($this->inboxIdOf($this->builder));

        $this->assertSame([1, 1, 1], [$counts->unread, $counts->unclaimed, $counts->claimed]);
    }

    public function test_the_author_sees_the_wake_and_others_find_nothing(): void
    {
        $questionId = $this->ownerAsks($this->inboxIdOf($this->builder), 'Awake?');

        $statuses = $this->resolver()->wakeStatus($questionId);

        $this->assertCount(1, $statuses);
        $this->assertSame($this->builder->agent_id, $statuses[0]->actorId);
        $this->assertNotNull($statuses[0]->requestId);

        $this->asAgent($this->reviewer);
        $this->assertThrows(fn () => $this->resolver()->wakeStatus($questionId), MessageMissing::class);
        $this->assertThrows(fn () => $this->resolver()->detail($questionId), MessageMissing::class);
        $this->assertSame(0, Message::query()->count());
    }

    private function resolver(): ConversationResolver
    {
        return $this->app->make(ConversationResolver::class);
    }
}
