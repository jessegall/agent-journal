<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Commands\ReplyToMessage\ReplyToMessageCommand;
use App\Contracts\Bus\RequestSource;
use App\Contracts\Chat\AgentMessageReader;
use App\Enums\AgentInboxState;
use App\Enums\ReadView;
use App\Exceptions\MessageMissing;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Messages\Message;
use App\Support\ActorIdentity;
use App\Support\StartSessions;
use Domain\Chat\Tests\TestCase;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\SendsMcpFrames;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;

final class AgentInboxTest extends TestCase
{
    use CommitsHookRows;
    use RunsKeyedCommands;
    use SendsMcpFrames;
    use StartsAgentRequests;
    use WritesInboxMessages;

    private const array TABLES = [
        'agents', 'agent_sessions', 'start_tokens', 'agent_stacks',
        'desks', 'desk_seats', 'desk_preferences', 'inboxes', 'assignments',
        'command_receipts', 'messages', 'message_attentions',
    ];

    public function test_the_message_schema_preserves_the_envelope_and_records_session_requests(): void
    {
        $this->assertTrue(Schema::hasColumns('messages', [
            'sender_type', 'sender_id', 'destination_inbox_id', 'reply_to_id',
            'answer_message_id', 'dismissal_reason', 'is_question', 'state_version', 'conversation_id',
        ]));

        $this->assertTrue(Schema::hasColumn('agent_sessions', 'selected_message_id'));
        $this->assertTrue(Schema::hasColumn('agent_sessions', 'job_source_message_id'));
    }

    public function test_the_inbox_and_overview_count_only_messages_addressed_to_the_caller(): void
    {
        $caller = TestStart::start();
        $own = $this->askInboxOf(ActorIdentity::of($caller->agent), 'A question for this inbox.');
        $unrelated = $this->askNobody('A different inbox.');
        $caller->startRequest($this->app);
        $reader = $this->app->make(AgentMessageReader::class);
        $inbox = $reader->inbox(AgentInboxState::Pending, 1);

        $this->assertSame([$own->id], array_column($inbox->messages, 'id'));
        $this->assertSame(1, $inbox->messages[0]->revision);
        $this->assertTrue($inbox->messages[0]->isQuestion);

        $this->assertThrows(
            fn () => $reader->message($unrelated->id, ReadView::Summary),
            MessageMissing::class,
        );

        $this->callMcpTool($caller, 'overview_read')
            ->assertJsonPath('result.structuredContent.sections.messages.counts.unread', 1)
            ->assertJsonPath('result.structuredContent.sections.messages.counts.pending', 1);

        $this->assertNull(AgentSession::selectedMessage($caller->session->id));
        $this->assertNull($own->refresh()->read_at);
    }

    public function test_a_long_body_resumes_and_the_parent_of_a_reply_is_read_without_selecting_it(): void
    {
        $caller = TestStart::start();
        $question = $this->askInboxOf(ActorIdentity::of($caller->agent), str_repeat('é', 600));
        $caller->startRequest($this->app);
        $reader = $this->app->make(AgentMessageReader::class);
        $first = $reader->message($question->id, ReadView::Context);
        $last = $reader->context($question->id, $first->continuation);

        $this->assertNotNull($first->body);
        $this->assertNotNull($last->body);
        $this->assertSame(str_repeat('é', 600), $first->body->text.$last->body->text);
        $this->assertNull($last->continuation);
        $this->assertNull($question->refresh()->read_at);

        $replyId = $this->runOnBus(new ReplyToMessageCommand($question->id, 0, 'An answer.'));
        $reply = $reader->context($replyId, null);
        $ancestor = $reader->context($replyId, $reply->continuation);

        $this->assertSame($question->id, $ancestor->message->id);
        $this->assertNull(AgentSession::selectedMessage($caller->session->id));
    }

    public function test_a_launch_keeps_the_source_it_captured_when_the_parent_selects_another_message(): void
    {
        $parent = TestStart::start();
        $actor = ActorIdentity::of($parent->agent);
        $first = $this->askInboxOf($actor, 'The launch source.');
        $second = $this->askInboxOf($actor, 'An unrelated next request.');
        $parent->startRequest($this->app);
        $this->selectMessage($parent->session->id, $first->id);
        $source = $this->app->make(RequestSource::class)->selectedSource();
        $child = Agent::create('Child', 'writing-helper');

        $started = $this->app->make(StartSessions::class)->start(
            $child,
            TestSelections::of(),
            TestSelections::requestId(),
            $parent->session,
            authorizedSource: $source,
        );

        $this->selectMessage($parent->session->id, $second->id);

        $this->assertSame($first->id, AgentSession::jobSourceMessage($started->session->id));

        $this->startRequestAs($child->id, $started->session->id);
        $reader = $this->app->make(AgentMessageReader::class);
        $this->assertTrue($reader->message($first->id, ReadView::Summary)->message->isJobSource);
        $this->assertFalse($reader->message($first->id, ReadView::Summary)->message->isSelected);
        $this->assertThrows(fn () => Message::visibleById($second->id), MessageMissing::class);
    }

    private function selectMessage(string $sessionId, string $messageId): void
    {
        AgentSession::query()->whereKey($sessionId)->update(['selected_message_id' => $messageId]);
    }
}
