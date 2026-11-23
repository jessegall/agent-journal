<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\SendMessage\SendMessageCommand;
use App\Enums\MessageState;
use App\Events\MessageSent;
use App\Exceptions\CommandInputInvalid;
use App\Exceptions\InboxUnavailable;
use App\Models\Agents\Agent;
use App\Models\Messages\Message;
use App\Support\ActorIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
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
    use RunsKeyedCommands;
    use StartsAgentRequests;
    use WritesInboxMessages;

    private const string BUILD_NOTICE = 'The build is green.';

    private const string BODY_REQUIRED = 'body: The body field is required.';

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
        $builder = ActorIdentity::of(Agent::create('Builder', 'read-only-helper'));
        $this->builderInboxId = $this->inboxOf($builder)->inboxId();
    }

    public function test_a_sent_message_keeps_its_text_and_both_inboxes_and_waits_for_nobody(): void
    {
        $messageId = $this->runOnBus(new SendMessageCommand($this->ownInboxId, $this->builderInboxId, self::BUILD_NOTICE));

        $message = Message::query()->findOrFail($messageId);
        $this->assertSame(self::BUILD_NOTICE, $message->body);
        $this->assertSame($this->ownInboxId, $message->source_inbox_id);
        $this->assertSame($this->builderInboxId, $message->destination_inbox_id);
        $this->assertSame(MessageState::Sent, $message->state);
        Event::assertDispatched(MessageSent::class, fn (MessageSent $sent) => $sent->messageId === $messageId);
    }

    public function test_the_same_request_sent_again_gives_back_the_same_message(): void
    {
        $key = (string) Str::ulid();
        $command = new SendMessageCommand($this->ownInboxId, $this->builderInboxId, 'Once.');

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
            fn () => $this->runOnBus(new SendMessageCommand($this->builderInboxId, $this->ownInboxId, 'Not mine to send.')),
            InboxUnavailable::class,
        );
        $this->assertThrows(
            fn () => $this->runOnBus(new SendMessageCommand($this->ownInboxId, (string) Str::ulid(), 'Nowhere.')),
            InboxUnavailable::class,
        );

        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_a_blank_message_is_refused_naming_its_body_and_nothing_is_sent(): void
    {
        $this->assertThrows(
            fn () => $this->runOnBus(new SendMessageCommand($this->ownInboxId, $this->builderInboxId, "  \n")),
            CommandInputInvalid::class,
            self::BODY_REQUIRED,
        );
        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }
}
