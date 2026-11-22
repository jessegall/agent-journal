<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Bus\Support\RequestKey;
use App\Communication\Events\MessageSent;
use App\CoreApi;
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

    public function test_a_domain_asks_through_core_alone_and_hears_the_message_sent(): void
    {
        Event::fake([MessageSent::class]);
        $this->ownerInboxId();
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        $view = $this->app->make(ReviewRequests::class)->ask($this->assigneeOf($this->builder), self::REVIEW_QUESTION);

        $this->assertSame(self::REVIEW_QUESTION, $view->body);
        $this->assertSame($this->inboxIdOf($this->builder), $view->destinationInboxId);
        Event::assertDispatched(MessageSent::class, fn (MessageSent $sent) => $sent->messageId === $view->id);
    }

    public function test_the_consumer_names_only_types_core_exports(): void
    {
        $source = (string) file_get_contents(base_path('tests/Fixtures/Domains/Reviews/Messaging/ReviewRequests.php'));
        preg_match_all('/^use (App\\\\[^;]+);$/m', $source, $uses);
        $exports = CoreApi::exports();

        foreach ($uses[1] as $used) {
            $this->assertTrue($exports->has($used), $used);
        }
    }
}
