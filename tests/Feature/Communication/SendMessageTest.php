<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\AgentRole;
use App\Agents\Models\Agent;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Communication\Commands\SendMessage;
use App\Communication\Enums\MessageState;
use App\Communication\Events\MessageSent;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Exceptions\MessageBodyEmpty;
use App\Communication\Models\Message;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * A member of a source inbox sends or asks to another inbox: the message keeps its text and its two inboxes, a resent
 * request gives back the same message, and an inbox the sender may not use refuses and leaves nothing.
 */
final class SendMessageTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;
    use WritesInboxMessages;

    private const array TABLES = [
        'users',
        'agents',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'messages',
        'message_attentions',
    ];

    private string $ownInboxId;

    private string $builderInboxId;

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([MessageSent::class]);
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
        $this->ownInboxId = $this->inboxOf(ActorIdentity::of($owner))->inboxId();
        $builder = ActorIdentity::of(Agent::named('Builder', AgentRole::ReadOnlyHelper));
        $this->builderInboxId = $this->inboxOf($builder)->inboxId();
    }

    public function test_a_sent_message_keeps_its_text_and_both_inboxes_and_waits_for_nobody(): void
    {
        $messageId = $this->runOnBus(new SendMessage($this->ownInboxId, $this->builderInboxId, 'The build is green.'));

        $message = Message::query()->findOrFail($messageId);
        $this->assertSame('The build is green.', $message->body);
        $this->assertSame($this->ownInboxId, $message->source_inbox_id);
        $this->assertSame($this->builderInboxId, $message->destination_inbox_id);
        $this->assertSame(MessageState::Sent, $message->state);
        Event::assertDispatched(MessageSent::class, fn (MessageSent $sent) => $sent->messageId === $messageId);
    }

    public function test_the_same_request_sent_again_gives_back_the_same_message(): void
    {
        $key = (string) Str::ulid();
        $command = new SendMessage($this->ownInboxId, $this->builderInboxId, 'Once.');

        $first = $this->runOnBus($command, $key);
        $this->app->forgetScopedInstances();
        $this->startUserRequestAs(User::query()->sole()->id);
        $second = $this->runOnBus($command, $key);

        $this->assertSame($first, $second);
        $this->assertSame(1, Message::query()->count());
    }

    public function test_an_inbox_the_sender_is_not_seated_at_refuses_and_leaves_no_message(): void
    {
        $this->assertThrows(
            fn () => $this->runOnBus(new SendMessage($this->builderInboxId, $this->ownInboxId, 'Not mine to send.')),
            InboxUnavailable::class,
        );
        $this->assertThrows(
            fn () => $this->runOnBus(new SendMessage($this->ownInboxId, (string) Str::ulid(), 'Nowhere.')),
            InboxUnavailable::class,
        );

        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_a_blank_message_is_refused(): void
    {
        $this->expectException(MessageBodyEmpty::class);

        $this->runOnBus(new SendMessage($this->ownInboxId, $this->builderInboxId, "  \n"));
    }

    private function runOnBus(object $command, string|null $key = null): mixed
    {
        $this->app->make(RequestKey::class)->set($key ?? (string) Str::ulid());

        return $this->app->make(CommandBus::class)->run($command);
    }
}
