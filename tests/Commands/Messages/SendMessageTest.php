<?php

declare(strict_types=1);

namespace Tests\Commands\Messages;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Events\Messages\MessageSent;
use App\Exceptions\CommandInputInvalid;
use App\Exceptions\InboxUnavailable;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Messages\Message;
use App\Support\ActorIdentity;
use App\Support\DomainRegistry;
use App\Support\StartSessions;
use Domain\Chat\Http\Requests\ConversationRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * A member of an inbox sends to it: the message keeps its text and sender under the inbox's next number, a reply names
 * its target by number, a resent request gives back the same message, and an inbox the sender is not attached to, an
 * unknown target or a blank body is refused and leaves nothing.
 */
final class SendMessageTest extends TestCase
{
    use CommitsHookRows;

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
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'links',
        'plans',
        'rules',
    ];

    private string $ownInboxId;

    private string $builderInboxId;

    private AgentSession $session;

    private string $chatInboxId;

    private int $sends = 0;

    /**
     * Every installed domain, since the chat send route the page posts to is the Chat domain's.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([MessageSent::class]);
        $this->journal->agent('Builder', 'read-only-helper')->owner();
        $this->ownInboxId = $this->journal->inboxCalled('Owner')->id;
        $this->builderInboxId = $this->journal->inboxCalled('Builder')->id;
    }

    public function test_a_sent_message_keeps_its_text_and_sender_under_the_inboxs_next_number(): void
    {
        $firstId = $this->journal->run(new SendMessageCommand($this->ownInboxId, 'First.'));
        $messageId = $this->journal->run(new SendMessageCommand($this->ownInboxId, self::BUILD_NOTICE));

        $message = Message::query()->findOrFail($messageId);
        $this->assertSame(self::BUILD_NOTICE, $message->body);
        $this->assertSame($this->ownInboxId, $message->inbox_id);
        $this->assertSame(ActorIdentity::of($this->journal->ownerUser())->id, $message->sender_id);
        $this->assertSame(Message::query()->findOrFail($firstId)->number + 1, $message->number);
        Event::assertDispatched(MessageSent::class, fn (MessageSent $sent) => $sent->messageId === $messageId);
    }

    public function test_a_reply_names_its_target_by_number_and_an_unknown_number_sends_nothing(): void
    {
        $targetId = $this->journal->run(new SendMessageCommand($this->ownInboxId, 'Ready?'));
        $target = Message::query()->findOrFail($targetId);

        $replyId = $this->journal->run(new SendMessageCommand($this->ownInboxId, 'Yes.', $target->number));

        $this->assertSame($targetId, Message::query()->findOrFail($replyId)->target_message_id);
        $this->assertThrows(
            fn () => $this->journal->run(new SendMessageCommand($this->ownInboxId, 'To nothing.', $target->number + 5)),
            ModelNotFoundException::class,
        );
        $this->assertSame(2, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_the_same_request_sent_again_gives_back_the_same_message(): void
    {
        $key = (string) Str::ulid();
        $command = new SendMessageCommand($this->ownInboxId, 'Once.');

        $first = $this->journal->run($command, $key);
        $this->journal->actAs('Owner');
        $second = $this->journal->run($command, $key);

        $this->assertSame($first, $second);
        $this->assertSame(1, Message::query()->count());
    }

    public function test_an_inbox_the_sender_is_not_attached_to_refuses_and_leaves_no_message(): void
    {
        $this->assertThrows(
            fn () => $this->journal->run(new SendMessageCommand($this->builderInboxId, 'Not mine to send.')),
            InboxUnavailable::class,
        );
        $this->assertThrows(
            fn () => $this->journal->run(new SendMessageCommand((string) Str::ulid(), 'Nowhere.')),
            InboxUnavailable::class,
        );

        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_a_blank_message_is_refused_naming_its_body_and_nothing_is_sent(): void
    {
        $this->assertThrows(
            fn () => $this->journal->run(new SendMessageCommand($this->ownInboxId, "  \n")),
            CommandInputInvalid::class,
            self::BODY_REQUIRED,
        );
        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_a_sent_message_keeps_its_indentation_and_returns_to_the_conversation(): void
    {
        $agent = Agent::create('Chat builder', 'main-agent', $this->localProject());
        $this->session = $this->app->make(StartSessions::class)->start(
            $agent,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        )->session;
        $this->chatInboxId = $this->journal->inboxes()->pairChat(
            ActorIdentity::of($this->journal->ownerUser()),
            ActorIdentity::of($agent),
        )->id;

        $body = <<<'TEXT'
          Please check:
            - the indented line

        then answer.  

        TEXT;

        $home = route(
            'home',
            ConversationRequest::queryFor($this->session->agent_id),
            false,
        );

        $this->actingAs($this->journal->ownerUser())->from($home)->post(
            '/chat/messages',
            [...$this->pair(), 'body' => $body, ...$this->seenSession()],
        )
            ->assertStatus(303)
            ->assertRedirect($home);

        $this->assertSame([$body], Message::query()->withoutGlobalScopes()->pluck('body')->all());
        $this->actingAs($this->journal->ownerUser())->get($home)->assertInertia(fn (AssertableInertia $page) => $page
            ->reloadOnly('window_chat_conversation', fn (AssertableInertia $reload) => $reload
                ->where('window_chat_conversation.data.conversation.inboxId', $this->chatInboxId)
                ->where('window_chat_conversation.data.conversation.sessionId', (string) $this->session->id)));
    }

    public function test_a_message_written_for_a_session_the_agent_no_longer_runs_is_not_delivered(): void
    {
        $agent = Agent::create('Chat builder', 'main-agent', $this->localProject());
        $this->session = $this->app->make(StartSessions::class)->start(
            $agent,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        )->session;
        $this->chatInboxId = $this->journal->inboxes()->pairChat(
            ActorIdentity::of($this->journal->ownerUser()),
            ActorIdentity::of($agent),
        )->id;

        $outdated = [...$this->seenSession(), 'expectedSessionId' => strtolower((string) Str::ulid())];

        $this->actingAs($this->journal->ownerUser())->from('/')
            ->post('/chat/messages', [...$this->pair(), 'body' => 'Still there?', ...$outdated])
            ->assertRedirect('/')
            ->assertSessionHasErrors(
                ['session' => 'The agent now runs another session. Send the message again to reach it.'],
            );
        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }

    /**
     * The agent a send goes to and the session the sender saw it run.
     *
     * @return array{agent: string, expectedSessionId: string, expectedGeneration: int}
     */
    private function seenSession(): array
    {
        return [
            'agent' => $this->session->agent_id,
            'expectedSessionId' => $this->session->id,
            'expectedGeneration' => AgentRuntime::findForSession($this->session->id)?->process_generation ?? 0,
        ];
    }

    /**
     * The pair's chat inbox and a request key of the send's own.
     *
     * @return array{inboxId: string, requestKey: string}
     */
    private function pair(): array
    {
        return ['inboxId' => $this->chatInboxId, 'requestKey' => 'home-send-'.++$this->sends];
    }
}
