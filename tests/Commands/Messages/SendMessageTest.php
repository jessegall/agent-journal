<?php

declare(strict_types=1);

namespace Tests\Commands\Messages;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Events\Messages\MessageSent;
use App\Exceptions\CommandInputInvalid;
use App\Exceptions\InboxUnavailable;
use App\Models\Messages\Message;
use App\Support\ActorIdentity;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Seeding\SeedsJournal;
use Tests\TestCase;

/**
 * A member of an inbox sends to it: the message keeps its text and sender under the inbox's next number, a reply names
 * its target by number, a resent request gives back the same message, and an inbox the sender is not attached to, an
 * unknown target or a blank body is refused and leaves nothing.
 */
final class SendMessageTest extends TestCase
{
    use CommitsHookRows;
    use SeedsJournal;

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

    private string $ownInboxId;

    private string $builderInboxId;

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([MessageSent::class]);
        $this->journal()->agent('Builder', 'read-only-helper')->owner();
        $this->ownInboxId = $this->journal()->inboxOf('Owner')->id;
        $this->builderInboxId = $this->journal()->inboxOf('Builder')->id;
    }

    public function test_a_sent_message_keeps_its_text_and_sender_under_the_inboxs_next_number(): void
    {
        $firstId = $this->journal()->run(new SendMessageCommand($this->ownInboxId, 'First.'));
        $messageId = $this->journal()->run(new SendMessageCommand($this->ownInboxId, self::BUILD_NOTICE));

        $message = Message::query()->findOrFail($messageId);
        $this->assertSame(self::BUILD_NOTICE, $message->body);
        $this->assertSame($this->ownInboxId, $message->inbox_id);
        $this->assertSame(ActorIdentity::of($this->journal()->ownerUser())->id, $message->sender_id);
        $this->assertSame(Message::query()->findOrFail($firstId)->number + 1, $message->number);
        Event::assertDispatched(MessageSent::class, fn (MessageSent $sent) => $sent->messageId === $messageId);
    }

    public function test_a_reply_names_its_target_by_number_and_an_unknown_number_sends_nothing(): void
    {
        $targetId = $this->journal()->run(new SendMessageCommand($this->ownInboxId, 'Ready?'));
        $target = Message::query()->findOrFail($targetId);

        $replyId = $this->journal()->run(new SendMessageCommand($this->ownInboxId, 'Yes.', $target->number));

        $this->assertSame($targetId, Message::query()->findOrFail($replyId)->target_message_id);
        $this->assertThrows(
            fn () => $this->journal()->run(new SendMessageCommand($this->ownInboxId, 'To nothing.', $target->number + 5)),
            ModelNotFoundException::class,
        );
        $this->assertSame(2, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_the_same_request_sent_again_gives_back_the_same_message(): void
    {
        $key = (string) Str::ulid();
        $command = new SendMessageCommand($this->ownInboxId, 'Once.');

        $first = $this->journal()->run($command, $key);
        $this->app->forgetScopedInstances();
        $this->journal()->actAs('Owner');
        $second = $this->journal()->run($command, $key);

        $this->assertSame($first, $second);
        $this->assertSame(1, Message::query()->count());
    }

    public function test_an_inbox_the_sender_is_not_attached_to_refuses_and_leaves_no_message(): void
    {
        $this->assertThrows(
            fn () => $this->journal()->run(new SendMessageCommand($this->builderInboxId, 'Not mine to send.')),
            InboxUnavailable::class,
        );
        $this->assertThrows(
            fn () => $this->journal()->run(new SendMessageCommand((string) Str::ulid(), 'Nowhere.')),
            InboxUnavailable::class,
        );

        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_a_blank_message_is_refused_naming_its_body_and_nothing_is_sent(): void
    {
        $this->assertThrows(
            fn () => $this->journal()->run(new SendMessageCommand($this->ownInboxId, "  \n")),
            CommandInputInvalid::class,
            self::BODY_REQUIRED,
        );
        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }
}
