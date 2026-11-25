<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Events\Messages\MessageSent;
use App\Models\Messages\Message;
use App\Support\RequestKey;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Fixtures\Domains\Reviews\Messaging\ReviewRequests;
use Tests\Support\MessagingTestCase;

/**
 * A domain other than Chat asks for an answer and reads it back through Core's exported messaging API alone, and
 * receives the message it sent.
 */
final class DomainConsumerTest extends MessagingTestCase
{
    private const string REVIEW_QUESTION = 'Review this?';

    public function test_a_domain_posts_through_core_alone_and_hears_the_message_sent(): void
    {
        Event::fake([MessageSent::class]);
        $inboxId = $this->ownerInboxId();
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        $messageId = $this->app->make(ReviewRequests::class)->post($inboxId, self::REVIEW_QUESTION);

        $message = Message::query()->findOrFail($messageId);
        $this->assertSame(self::REVIEW_QUESTION, $message->body);
        $this->assertSame($inboxId, $message->inbox_id);
        Event::assertDispatched(MessageSent::class, fn (MessageSent $sent) => $sent->messageId === $messageId);
    }
}
