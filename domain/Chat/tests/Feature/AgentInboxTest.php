<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Commands\Messages\ReplyToMessage\ReplyToMessageCommand;
use App\Contracts\Chat\AgentMessageReader;
use App\Enums\Agents\AgentInboxState;
use App\Enums\CommandRules\ReadView;
use App\Exceptions\MessageMissing;
use App\Support\ActorIdentity;
use Domain\Chat\Tests\TestCase;
use Illuminate\Support\Facades\Schema;
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
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'desks',
        'desk_seats',
        'desk_preferences',
        'inboxes',
        'assignments',
        'command_receipts',
        'messages',
        'message_attentions',
    ];

    public function test_the_message_schema_preserves_the_envelope_and_records_session_requests(): void
    {
        $this->assertTrue(Schema::hasColumns('messages', [
            'sender_type',
            'sender_id',
            'destination_inbox_id',
            'reply_to_id',
            'answer_message_id',
            'dismissal_reason',
            'is_question',
            'state_version',
            'conversation_id',
        ]));

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
    }
}
