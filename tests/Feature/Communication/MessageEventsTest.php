<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Communication\Commands\SendMessage;
use App\Communication\Events\MessageSent;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Models\Message;
use App\Domains\Support\FailureLoggingListener;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use ReflectionClass;
use ReflectionNamedType;
use Tests\Fixtures\Communication\FailingMessageListener;
use Tests\Support\MessagingTestCase;

/**
 * Message facts are told after commit, once: a refused send tells nothing, a resent request tells nothing again, a
 * failing listener leaves the message and the caller's success alone, and no fact carries a body or a model.
 */
final class MessageEventsTest extends MessagingTestCase
{
    /**
     * @var list<string>
     */
    private array $heard = [];

    protected function setUp(): void
    {
        parent::setUp();

        Event::listen(MessageSent::class, function (MessageSent $sent): void {
            $this->heard[] = $sent->messageId;
        });
    }

    public function test_a_refused_send_tells_nothing_and_a_resent_request_tells_nothing_again(): void
    {
        $this->assertThrows(fn () => $this->ownerSends((string) Str::ulid(), 'Nowhere.'), InboxUnavailable::class);
        $key = (string) Str::ulid();
        $command = new SendMessage($this->ownerInboxId(), $this->inboxIdOf($this->builder), 'Once.');

        $first = $this->runOnBus($command, $key);
        $this->asOwner();
        $this->runOnBus($command, $key);

        $this->assertSame([$first], $this->heard);
    }

    public function test_a_failing_listener_leaves_the_message_and_the_success_alone(): void
    {
        Event::listen(MessageSent::class, new FailureLoggingListener(
            MessageSent::class,
            FailingMessageListener::class.'@handle',
        ));

        $messageId = $this->ownerSends($this->inboxIdOf($this->builder), 'Still saved.');

        $this->assertSame('Still saved.', Message::query()->findOrFail($messageId)->body);
        $this->assertSame([$messageId], $this->heard);
    }

    public function test_no_message_fact_carries_a_body_or_a_model(): void
    {
        foreach (glob(app_path('Communication/Events/*.php')) ?: [] as $file) {
            $parameters = new ReflectionClass('App\\Communication\\Events\\'.basename($file, '.php'))
                ->getConstructor()?->getParameters() ?? [];

            foreach ($parameters as $parameter) {
                $type = $parameter->getType();
                $this->assertNotSame('body', $parameter->getName(), basename($file));
                $this->assertFalse(
                    $type instanceof ReflectionNamedType && is_subclass_of($type->getName(), Model::class),
                    basename($file),
                );
            }
        }
    }
}
