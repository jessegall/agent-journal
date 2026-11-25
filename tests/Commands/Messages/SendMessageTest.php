<?php

declare(strict_types=1);

namespace Tests\Commands\Messages;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Events\Messages\MessageSent;
use App\Exceptions\CommandInputInvalid;
use App\Exceptions\InboxUnavailable;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Messages\Message;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * A member of an inbox sends to it: the message keeps its text and sender under the inbox's next number, a reply names
 * its target by number, a resent request gives back the same message, and an inbox the sender is not attached to, an
 * unknown target or a blank body is refused and leaves nothing.
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
        'inbox_members',
        'assignments',
        'command_receipts',
        'messages',
    ];

    private User $owner;

    private string $ownInboxId;

    private string $builderInboxId;

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([MessageSent::class]);
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->startUserRequestAs($this->owner->id);
        $this->ownInboxId = $this->inboxOf(ActorIdentity::of($this->owner))->id;
        $builder = ActorIdentity::of(Agent::create('Builder', 'read-only-helper', $this->localProject()));
        $this->builderInboxId = $this->inboxOf($builder)->id;
    }

    public function test_a_sent_message_keeps_its_text_and_sender_under_the_inboxs_next_number(): void
    {
        $firstId = $this->runOnBus(new SendMessageCommand($this->ownInboxId, 'First.'));
        $messageId = $this->runOnBus(new SendMessageCommand($this->ownInboxId, self::BUILD_NOTICE));

        $message = Message::query()->findOrFail($messageId);
        $this->assertSame(self::BUILD_NOTICE, $message->body);
        $this->assertSame($this->ownInboxId, $message->inbox_id);
        $this->assertSame(ActorIdentity::of($this->owner)->id, $message->sender_id);
        $this->assertSame(Message::query()->findOrFail($firstId)->number + 1, $message->number);
        Event::assertDispatched(MessageSent::class, fn (MessageSent $sent) => $sent->messageId === $messageId);
    }

    public function test_a_reply_names_its_target_by_number_and_an_unknown_number_sends_nothing(): void
    {
        $targetId = $this->runOnBus(new SendMessageCommand($this->ownInboxId, 'Ready?'));
        $target = Message::query()->findOrFail($targetId);

        $replyId = $this->runOnBus(new SendMessageCommand($this->ownInboxId, 'Yes.', $target->number));

        $this->assertSame($targetId, Message::query()->findOrFail($replyId)->target_message_id);
        $this->assertThrows(
            fn () => $this->runOnBus(new SendMessageCommand($this->ownInboxId, 'To nothing.', $target->number + 5)),
            ModelNotFoundException::class,
        );
        $this->assertSame(2, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_the_same_request_sent_again_gives_back_the_same_message(): void
    {
        $key = (string) Str::ulid();
        $command = new SendMessageCommand($this->ownInboxId, 'Once.');

        $first = $this->runOnBus($command, $key);
        $this->app->forgetScopedInstances();
        $this->startUserRequestAs($this->owner->id);
        $second = $this->runOnBus($command, $key);

        $this->assertSame($first, $second);
        $this->assertSame(1, Message::query()->count());
    }

    public function test_an_inbox_the_sender_is_not_attached_to_refuses_and_leaves_no_message(): void
    {
        $this->assertThrows(
            fn () => $this->runOnBus(new SendMessageCommand($this->builderInboxId, 'Not mine to send.')),
            InboxUnavailable::class,
        );
        $this->assertThrows(
            fn () => $this->runOnBus(new SendMessageCommand((string) Str::ulid(), 'Nowhere.')),
            InboxUnavailable::class,
        );

        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_a_blank_message_is_refused_naming_its_body_and_nothing_is_sent(): void
    {
        $this->assertThrows(
            fn () => $this->runOnBus(new SendMessageCommand($this->ownInboxId, "  \n")),
            CommandInputInvalid::class,
            self::BODY_REQUIRED,
        );
        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }
}
