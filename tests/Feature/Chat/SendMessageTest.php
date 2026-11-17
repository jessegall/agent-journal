<?php

declare(strict_types=1);

namespace Tests\Feature\Chat;

use App\Core\Actors\Support\ActorContext;
use App\Core\Agents\Actions\LaunchSessions;
use App\Core\Agents\Models\Agent;
use App\Core\Actors\Contracts\CurrentActorSetter;
use App\Core\Agents\Exceptions\StackTargetRefused;
use App\Core\Hooks\Models\AgentStackRow;
use App\Core\Hooks\Storage\FrameRecord;
use App\Core\Agents\Support\StackTarget;
use App\Domain\Chat\Actions\CloseMessage;
use App\Domain\Chat\Actions\SendMessage;
use App\Domain\Chat\Api\Events\MessageAnswered;
use App\Domain\Chat\Api\Events\MessageDismissed;
use App\Domain\Chat\Api\Events\MessageSent;
use App\Domain\Chat\Api\MessageView;
use App\Domain\Chat\Enums\MessageState;
use App\Domain\Chat\Exceptions\MessageBodyEmpty;
use App\Domain\Chat\Models\Message;
use App\Domain\Chat\Readers\MessageRecords;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
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
        $agent = Agent::query()->create(['name' => 'Builder', 'role' => 'hooks.main_ready']);
        $session = $this->app->make(LaunchSessions::class)->launch($agent, 'claude-code')->session;
        $this->target = new StackTarget($session->agent_id, $session->id);
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(7));
    }

    public function test_a_sent_message_keeps_its_text_waits_for_the_agent_and_sits_on_its_stack(): void
    {
        $body = "Please check:\n    - the indented line\n\nthen answer.";

        $this->app->make(SendMessage::class)->send($body, $this->target);

        $stored = Message::query()->ownedBy($this->target->agentId)->sole();
        $this->assertSame([$body, MessageState::WaitingForAnswer, $this->target->sessionId], [$stored->body, $stored->state, $stored->session_id]);
        $this->assertSame(['hooks.main_ready', 'chat.answering'], $this->stackTypeKeys());
        Event::assertDispatched(MessageSent::class, fn (MessageSent $event) => $event->messageId === $stored->id);
    }

    public function test_a_guessed_target_is_refused_and_leaves_no_message(): void
    {
        try {
            $this->app->make(SendMessage::class)->send('Hello', new StackTarget($this->target->agentId, $this->target->sessionId + 100));
            $this->fail('A guessed target took a message.');
        } catch (StackTargetRefused) {
            $this->assertSame(0, Message::query()->ownedBy($this->target->agentId)->count());
            Event::assertNotDispatched(MessageSent::class);
        }
    }

    public function test_a_blank_message_is_refused(): void
    {
        $this->expectException(MessageBodyEmpty::class);

        $this->app->make(SendMessage::class)->send("  \n\t ", $this->target);
    }

    public function test_the_user_reads_the_conversation_with_that_session_only(): void
    {
        $this->app->make(SendMessage::class)->send('First', $this->target);
        $this->app->make(SendMessage::class)->send('Second', $this->target);

        $conversation = $this->app->make(MessageRecords::class)->conversationWith($this->target);

        $this->assertSame("{$this->target->agentId}-{$this->target->sessionId}", $conversation->id());
        $this->assertSame(['First', 'Second'], array_map(fn (MessageView $message) => $message->body, $conversation->messages));
    }

    public function test_answering_and_dismissing_raise_their_facts(): void
    {
        $this->app->make(SendMessage::class)->send('Answer me', $this->target);
        $this->app->make(SendMessage::class)->send('Never mind', $this->target);
        [$answered, $dismissed] = Message::query()->ownedBy($this->target->agentId)->orderBy('id')->get()->all();
        $close = $this->app->make(CloseMessage::class);

        $close->answer($answered);
        $close->dismiss($dismissed);

        Event::assertDispatched(MessageAnswered::class, fn (MessageAnswered $event) => $event->messageId === $answered->id);
        Event::assertDispatched(MessageDismissed::class, fn (MessageDismissed $event) => $event->messageId === $dismissed->id);
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
