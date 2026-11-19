<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Enums\AgentRole;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Models\Agent;
use App\Agents\Support\StackTarget;
use App\Bus\Contracts\CommandBus;
use App\Communication\Commands\AnswerMessage;
use App\Communication\Commands\DismissMessage;
use App\Communication\Commands\SendMessage;
use App\Communication\Data\MessageView;
use App\Communication\Enums\MessageState;
use App\Communication\Events\MessageAnswered;
use App\Communication\Events\MessageDismissed;
use App\Communication\Events\MessageSent;
use App\Communication\Exceptions\MessageBodyEmpty;
use App\Communication\Models\Message;
use App\Communication\Resolvers\MessageRecords;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Storage\FrameRecord;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner sends a message to a running agent's session with no agent context; it lands as the agent's own would.
 */
final class SendMessageTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls', 'messages', 'links'];

    private StackTarget $target;

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([MessageSent::class, MessageAnswered::class, MessageDismissed::class]);
        $agent = Agent::named('Builder', AgentRole::MainAgent);
        $session = $this->app->make(LaunchSessions::class)->launch($agent, TestSelections::of('claude-code'), TestSelections::requestId())->session;
        $this->target = new StackTarget($session->agent_id, $session->id);
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(7)), new OwnerAuthority('test'));
    }

    public function test_a_sent_message_keeps_its_text_waits_for_the_agent_and_sits_on_its_stack(): void
    {
        $body = "Please check:\n    - the indented line\n\nthen answer.";

        $this->send($body, $this->target->sessionId);

        $stored = Message::query()->ownedBy($this->target->agentId)->sole();
        $this->assertSame([$body, MessageState::WaitingForAnswer, $this->target->sessionId], [$stored->body, $stored->state, $stored->session_id]);
        $this->assertSame(['hooks.main_ready', 'communication.answering'], $this->stackTypeKeys());
        Event::assertDispatched(MessageSent::class, fn (MessageSent $event) => $event->messageId === $stored->id);
    }

    public function test_a_guessed_target_is_refused_and_leaves_no_message(): void
    {
        try {
            $this->send('Hello', TestIds::of(99999));
            $this->fail('A guessed target took a message.');
        } catch (StackTargetRefused) {
            $this->assertSame(0, Message::query()->ownedBy($this->target->agentId)->count());
            Event::assertNotDispatched(MessageSent::class);
        }
    }

    public function test_a_blank_message_is_refused(): void
    {
        $this->expectException(MessageBodyEmpty::class);

        $this->send("  \n\t ", $this->target->sessionId);
    }

    public function test_the_user_reads_the_conversation_with_that_session_only(): void
    {
        $this->send('First', $this->target->sessionId);
        $this->send('Second', $this->target->sessionId);

        $conversation = $this->app->make(MessageRecords::class)->conversationWith($this->target);

        $this->assertSame("{$this->target->agentId}-{$this->target->sessionId}", $conversation->id());
        $this->assertSame(['First', 'Second'], array_map(fn (MessageView $message) => $message->body, $conversation->messages));
    }

    public function test_answering_and_dismissing_raise_their_facts(): void
    {
        $this->send('Answer me', $this->target->sessionId);
        $this->send('Never mind', $this->target->sessionId);
        [$answered, $dismissed] = Message::query()->ownedBy($this->target->agentId)->orderBy('id')->get()->all();
        $this->app->make(CommandBus::class)->run(new AnswerMessage($answered->id, $answered->answer_round));
        $this->app->make(CommandBus::class)->run(new DismissMessage($dismissed->id, $dismissed->answer_round));

        Event::assertDispatched(MessageAnswered::class, fn (MessageAnswered $event) => $event->messageId === $answered->id);
        Event::assertDispatched(MessageDismissed::class, fn (MessageDismissed $event) => $event->messageId === $dismissed->id);
    }

    private function send(string $body, string $sessionId): void
    {
        $this->app->make(CommandBus::class)->run(new SendMessage($body, $sessionId));
    }

    /**
     * @return list<string>
     */
    private function stackTypeKeys(): array
    {
        return array_map(
            fn (FrameRecord $frame) => $frame->reference->typeKey,
            AgentStackRow::query()->authorizedFor($this->target)->sole()->frames->all(),
        );
    }
}
