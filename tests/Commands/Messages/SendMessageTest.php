<?php

declare(strict_types=1);

namespace Tests\Commands\Messages;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Enums\Agents\ActivityType;
use App\Events\Messages\MessageSent;
use App\Exceptions\CommandInputInvalid;
use App\Exceptions\CommittedFactListenerFailed;
use App\Exceptions\InboxUnavailable;
use App\Models\Agents\ActivityEntry;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Inboxes\InboxMember;
use App\Models\Messages\Message;
use App\Support\ActorIdentity;
use App\Support\DomainRegistry;
use App\Support\IsolatedListener;
use App\Support\StartSessions;
use Carbon\CarbonImmutable;
use Domain\Chat\Http\Requests\ConversationRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Communication\FailingMessageListener;
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
        'activity_entries',
    ];

    private string $ownInboxId;

    private string $builderInboxId;

    private AgentSession $session;

    private string $chatInboxId;

    private int $sends = 0;

    /**
     * @var list<string>
     */
    private array $received = [];

    private const string SAVED_TEXT = 'Still saved.';

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

        $this->journal->agent('Builder', 'read-only-helper')->owner();
        $this->ownInboxId = $this->journal->inboxCalled('Owner')->id;
        $this->builderInboxId = $this->journal->inboxCalled('Builder')->id;
    }

    public function test_a_sent_message_keeps_its_text_and_sender_under_the_inboxs_next_number(): void
    {
        Event::fake([MessageSent::class]);
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

    public function test_a_user_sends_to_the_chosen_agent_and_sees_the_pair_exchange(): void
    {
        $owner = $this->journal->ownerUser();
        $session = $this->journal->idleAgent('Chat builder')
            ->startSession('Chat builder', 'Chat builder')
            ->sessionCalled('Chat builder');

        $chatInboxId = $this->journal->inboxes()->pairChat(
            ActorIdentity::of($owner),
            ActorIdentity::ofClass(Agent::class, $session->agent_id),
        )->id;

        $window = ConversationRequest::queryFor($session->agent_id);
        $conversation = route('home', $window, false);

        $this->actingAs($owner)
            ->from($conversation)
            ->post('/chat/messages', [
                'inboxId' => $chatInboxId,
                'requestKey' => 'host-send-1',
                'body' => 'Is the build green?',
                'agent' => $session->agent_id,
                'expectedSessionId' => $session->id,
                'expectedGeneration' => AgentRuntime::findForSession($session->id)?->process_generation ?? 0,
            ])
            ->assertRedirect($conversation);

        $message = Message::query()->withoutGlobalScopes()->sole();
        $this->assertSame($chatInboxId, $message->inbox_id);

        $this->actingAs($owner)->get(route('home', $window, false))->assertInertia(fn (AssertableInertia $page) => $page
            ->reloadOnly('window_chat_conversation', fn (AssertableInertia $reload) => $reload
                ->where('window_chat_conversation.data.conversation.inboxId', $chatInboxId)));
    }

    public function test_a_refused_send_tells_nothing_and_a_resent_request_tells_nothing_again(): void
    {
        Event::listen(MessageSent::class, function (MessageSent $sent): void {
            $this->received[] = $sent->messageId;
        });

        $this->assertThrows(
            fn () => $this->journal->run(new SendMessageCommand((string) Str::ulid(), 'Nowhere.')),
            InboxUnavailable::class,
        );
        $key = (string) Str::ulid();
        $command = new SendMessageCommand($this->pairInboxId(), 'Once.');

        $first = $this->journal->run($command, $key);
        $this->journal->run($command, $key);

        $this->assertSame([$first], $this->received);
    }

    // A failing listener is never swallowed. The message stays saved, the listeners after it
    // still hear the fact, and then the failure is thrown.
    public function test_a_failing_listener_leaves_the_message_saved_and_heard_and_is_then_thrown(): void
    {
        Event::listen(MessageSent::class, function (MessageSent $sent): void {
            $this->received[] = $sent->messageId;
        });

        Event::listen(MessageSent::class, new IsolatedListener(
            MessageSent::class,
            FailingMessageListener::class.'@handle',
        ));

        $this->assertThrows(
            fn () => $this->journal->run(new SendMessageCommand($this->pairInboxId(), self::SAVED_TEXT)),
            CommittedFactListenerFailed::class,
        );

        $message = Message::query()->where('body', self::SAVED_TEXT)->sole();
        $this->assertSame([$message->id], $this->received);
    }

    public function test_an_agents_message_into_an_inbox_a_user_is_attached_to_is_a_post_of_that_agent(): void
    {
        $builder = $this->journal->agentCalled('Builder');
        InboxMember::create($this->ownInboxId, ActorIdentity::of($builder), CarbonImmutable::now());
        $this->journal->actAsAgentId($builder->id);

        $this->journal->run(new SendMessageCommand($this->ownInboxId, 'The build is green.'));

        $entry = ActivityEntry::query()->sole();
        $this->assertSame(ActivityType::Posted, $entry->type);
        $this->assertSame($builder->id, $entry->actor()->id);
    }

    public function test_messages_between_agents_alone_are_not_recorded(): void
    {
        $this->journal->agent('Reviewer', 'read-only-helper');
        $builder = $this->journal->agentCalled('Builder');
        $inboxId = $this->journal->inboxCalled('Reviewer')->id;
        InboxMember::create($inboxId, ActorIdentity::of($builder), CarbonImmutable::now());
        $this->journal->actAsAgentId($builder->id);

        $this->journal->run(new SendMessageCommand($inboxId, 'Over to you.'));

        $this->assertSame(0, ActivityEntry::query()->count());
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

    private function pairInboxId(): string
    {
        return $this->journal->inboxes()->pairChat(
            ActorIdentity::of($this->journal->ownerUser()),
            ActorIdentity::of($this->journal->agentCalled('Builder')),
        )->id;
    }
}
