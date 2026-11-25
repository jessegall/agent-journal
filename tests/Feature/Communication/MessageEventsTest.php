<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Events\Messages\MessageSent;
use App\Exceptions\CommittedFactListenerFailed;
use App\Exceptions\InboxUnavailable;
use App\Models\Messages\Message;
use App\Support\IsolatedListener;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Fixtures\Communication\FailingMessageListener;
use Tests\Support\MessagingTestCase;

/**
 * Message facts are told after commit, once: a refused send tells nothing, a resent request tells nothing again, a
 * failing listener leaves the message and the caller's success alone, and no fact carries a body or a model.
 */
final class MessageEventsTest extends MessagingTestCase
{
    private const string SAVED_TEXT = 'Still saved.';

    /**
     * @var list<string>
     */
    private array $received = [];

    protected function setUp(): void
    {
        parent::setUp();

        Event::listen(MessageSent::class, function (MessageSent $sent): void {
            $this->received[] = $sent->messageId;
        });
    }

    public function test_a_refused_send_tells_nothing_and_a_resent_request_tells_nothing_again(): void
    {
        $this->assertThrows(fn () => $this->ownerSends((string) Str::ulid(), 'Nowhere.'), InboxUnavailable::class);
        $key = (string) Str::ulid();
        $command = new SendMessageCommand($this->pairInboxIdOf($this->builder), 'Once.');

        $first = $this->journal->run($command, $key);
        $this->asOwner();
        $this->journal->run($command, $key);

        $this->assertSame([$first], $this->received);
    }

    // A failing listener is never swallowed. The message stays saved, the listeners after it
    // still hear the fact, and then the failure is thrown.
    public function test_a_failing_listener_leaves_the_message_saved_and_heard_and_is_then_thrown(): void
    {
        Event::listen(MessageSent::class, new IsolatedListener(
            MessageSent::class,
            FailingMessageListener::class.'@handle',
        ));

        $this->assertThrows(
            fn () => $this->ownerSends($this->pairInboxIdOf($this->builder), self::SAVED_TEXT),
            CommittedFactListenerFailed::class,
        );

        $message = Message::query()->where('body', self::SAVED_TEXT)->sole();
        $this->assertSame([$message->id], $this->received);
    }
}
