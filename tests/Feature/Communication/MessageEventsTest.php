<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\SendMessage\SendMessageCommand;
use App\Events\MessageSent;
use App\Exceptions\CommittedFactListenerFailed;
use App\Exceptions\InboxUnavailable;
use App\Models\Messages\Message;
use App\Support\DeclaredType;
use App\Support\IsolatedListener;
use App\Support\ReflectedMethod;
use App\Support\Reflector;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Architecture\Support\FormerPaths;
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
        $command = new SendMessageCommand($this->ownerInboxId(), $this->inboxIdOf($this->builder), 'Once.');

        $first = $this->runOnBus($command, $key);
        $this->asOwner();
        $this->runOnBus($command, $key);

        $this->assertSame([$first], $this->received);
    }

    // User message 19647: a failing listener is never swallowed. The message stays saved, the listeners after it
    // still hear the fact, and then the failure is thrown.
    public function test_a_failing_listener_leaves_the_message_saved_and_heard_and_is_then_thrown(): void
    {
        Event::listen(MessageSent::class, new IsolatedListener(
            MessageSent::class,
            FailingMessageListener::class.'@handle',
        ));

        $this->assertThrows(
            fn () => $this->ownerSends($this->inboxIdOf($this->builder), self::SAVED_TEXT),
            CommittedFactListenerFailed::class,
        );

        $message = Message::query()->where('body', self::SAVED_TEXT)->sole();
        $this->assertSame([$message->id], $this->received);
    }

    public function test_no_message_fact_carries_a_body_or_a_model(): void
    {
        // The message facts by the folder they had before plan 62 moved them to app/Events.
        foreach (FormerPaths::filesFrom(['app/Communication/Events/']) as $file) {
            $parameters = Reflector::of('App\\Events\\'.basename($file, '.php'))->constructor()
                ->map(fn (ReflectedMethod $constructor) => $constructor->parameters())
                ->getOrElse([]);

            foreach ($parameters as $parameter) {
                $holdsModel = $parameter->type()
                    ->filter(fn (DeclaredType $type) => $type->isNamed())
                    ->flatMap(fn (DeclaredType $type) => Reflector::find($type->name()))
                    ->filter(fn (Reflector $type) => $type->isSubclassOf(Model::class))
                    ->isDefined();
                $this->assertNotSame('body', $parameter->name(), basename($file));
                $this->assertFalse($holdsModel, basename($file));
            }
        }
    }
}
