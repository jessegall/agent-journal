<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\Messages\PostChatMessage\PostChatMessageCommand;
use App\Commands\Messages\ReplyInChat\ReplyInChatCommand;
use App\Enums\ReceiptDeliveryState;
use App\Events\Web\PageChanged;
use App\Events\Hooks\StateCommandAnswered;
use App\Listeners\RunStateCommand;
use App\Models\Agents\AgentStackRow;
use App\Models\Messages\Message;
use App\Models\Messages\MessageAttention;
use App\Models\Messages\MessageReceipt;
use App\Models\Messages\ReceiptDelivery;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\MessageBatchService;
use App\Support\States\Support\AnsweringMessageStateReference;
use App\Support\Storage\FrameRecord;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Domain\Chat\Commands\OpenPairChat\OpenPairChatCommand;
use Domain\Chat\Mcp\Tools\MessageReactionTool;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\TestStartAuthority;
use Tests\Support\MessagingTestCase;
use Tests\Support\SendsMcpFrames;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * One whole conversation as the journal sees it, through the doors a session really uses: the owner posts in the pair
 * chat, the agent is asked to wake, its driver is shown the text, the agent answers with one call of the journal's own
 * reply tool, which takes its turn and confirms what it was shown, and the owner's open pages are told each time
 *.
 */
#[TimeLimit(6, 'The conversation makes several signed tool calls.')]
final class ChatConversationTest extends MessagingTestCase
{
    use SendsMcpFrames;

    private const string CONTEXT_KEY = 'runtime:conversation:1';

    public function test_a_post_is_answered_through_the_journals_tools_and_the_owners_pages_are_told_each_time(): void
    {
        $agent = TestStart::start();
        $this->asOwner();
        $inboxId = $this->runOnBus(new OpenPairChatCommand($agent->agent->id));
        Event::fake([PageChanged::class]);

        $questionId = $this->runOnBus(new PostChatMessageCommand($inboxId, 'What is 2 plus 2?', 'owner-asks'));

        $this->assertOwnerPagesTold(1);
        $this->assertTrue(MessageAttention::query()->where('origin_id', $questionId)->exists());

        $shown = $this->app->make(MessageBatchService::class)->next(
            ActorIdentity::of($agent->agent),
            $agent->session->id,
            1,
            self::CONTEXT_KEY,
            CarbonImmutable::now(),
        );
        $this->assertNotNull($shown);

        $told = Event::dispatched(PageChanged::class)->count();

        // One call answers: it takes the agent's turn and confirms what its session was shown.
        $answerId = $this->useTool($agent, 'messages_reply', [
            'message_id' => $questionId,
            'body' => '2 plus 2 is 4.',
            'request_key' => 'agent-answers',
        ])['message_id'];

        $this->assertOwnerPagesTold($told + 1);
        $answer = Message::query()->acrossInboxes()->findOrFail($answerId);
        $this->assertSame([$questionId, $inboxId], [$answer->reply_to_id, $answer->destination_inbox_id]);
        $receipts = MessageReceipt::query()->where('message_id', $questionId);
        $this->assertSame(0, (clone $receipts)->notPresented()->count());
        $this->assertSame(
            [ReceiptDeliveryState::Accepted],
            ReceiptDelivery::query()->whereIn('receipt_id', $receipts->select('id'))->pluck('state')->all(),
        );
    }

    public function test_a_message_sent_to_a_running_agent_is_kept_by_the_answering_state_on_its_stack_until_it_replies(): void
    {
        $agent = TestStart::start();
        $agent->openStack($this->app);
        $this->asOwner();
        $inboxId = $this->runOnBus(new OpenPairChatCommand($agent->agent->id));

        $firstId = $this->runOnBus(new PostChatMessageCommand($inboxId, 'What is 2 plus 2?', 'owner-asks'));
        $secondId = $this->runOnBus(new PostChatMessageCommand($inboxId, 'And 3 plus 3?', 'owner-asks-again'));

        $this->assertSame(
            [['waitingIds' => [$firstId, $secondId], 'toolUses' => 0, 'refusedStops' => 0]],
            $this->answeringValuesOf($agent, $inboxId),
        );

        $this->app->make(MessageBatchService::class)->next(
            ActorIdentity::of($agent->agent),
            $agent->session->id,
            1,
            self::CONTEXT_KEY,
            CarbonImmutable::now(),
        );

        $this->useTool($agent, 'messages_reply', [
            'message_id' => $firstId,
            'body' => '4, and 6.',
            'request_key' => 'agent-answers-both',
        ]);

        $this->assertSame(
            [['waitingIds' => [], 'toolUses' => 0, 'refusedStops' => 0]],
            $this->answeringValuesOf($agent, $inboxId),
        );
    }

    public function test_a_reply_a_state_answers_with_runs_under_a_key_made_from_the_answer(): void
    {
        $agent = TestStart::start();
        $agent->openStack($this->app);
        $this->asOwner();
        $inboxId = $this->runOnBus(new OpenPairChatCommand($agent->agent->id));
        $questionId = $this->runOnBus(new PostChatMessageCommand($inboxId, 'What is 2 plus 2?', 'owner-asks'));
        $this->app->make(MessageBatchService::class)->next(
            ActorIdentity::of($agent->agent),
            $agent->session->id,
            1,
            self::CONTEXT_KEY,
            CarbonImmutable::now(),
        );
        $agent->startRequest($this->app);
        $answered = new StateCommandAnswered(
            new StackTarget($agent->agent->id, $agent->session->id),
            new ReplyInChatCommand($questionId, 'Four.', 'stop-turn-1', $inboxId),
            ActorContext::forAgent($agent->agent->id),
            TestStartAuthority::forAgent($agent->agent->id),
        );

        // A hook request carries no request key of its own, and the same answer heard twice posts once.
        $this->app->make(RunStateCommand::class)->handle($answered);
        $this->app->make(RunStateCommand::class)->handle($answered);

        $this->assertSame(1, Message::query()->where('body', 'Four.')->count());
    }

    public function test_a_reaction_of_the_agent_answers_what_waited_in_the_chat(): void
    {
        $agent = TestStart::start();
        $agent->openStack($this->app);
        $this->asOwner();
        $inboxId = $this->runOnBus(new OpenPairChatCommand($agent->agent->id));
        $messageId = $this->runOnBus(new PostChatMessageCommand($inboxId, 'Thanks!', 'owner-thanks'));

        $this->useTool($agent, MessageReactionTool::NAME, [
            'chat_id' => $inboxId,
            'message_id' => $messageId,
            'emoji' => "\u{1F44D}",
            'request_key' => 'agent-reacts',
        ]);

        $this->assertSame(
            [['waitingIds' => [], 'toolUses' => 0, 'refusedStops' => 0]],
            $this->answeringValuesOf($agent, $inboxId),
        );
    }

    public function test_an_agent_that_was_never_shown_a_message_cannot_answer_it(): void
    {
        $agent = TestStart::start();
        $this->asOwner();
        $inboxId = $this->runOnBus(new OpenPairChatCommand($agent->agent->id));
        $questionId = $this->runOnBus(new PostChatMessageCommand($inboxId, 'What is 2 plus 2?', 'owner-asks'));

        $result = (array) $this->callMcpTool($agent, 'messages_reply', [
            'message_id' => $questionId,
            'body' => '4.',
            'request_key' => 'agent-answers-unseen',
        ])->json('result');

        $this->assertTrue($result['isError']);
        $this->assertSame(0, Message::query()->acrossInboxes()->where('reply_to_id', $questionId)->count());
    }

    /**
     * Calls one of the journal's tools as the agent and answers what it gave; a refusal fails with the tool's own words.
     *
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    private function useTool(TestStart $agent, string $name, array $arguments): array
    {
        $result = (array) $this->callMcpTool($agent, $name, $arguments)->json('result');

        $this->assertFalse($result['isError'], (string) json_encode($result));

        return (array) $result['structuredContent'];
    }

    /**
     * What the answering frames of that chat on the agent's stack keep, finished ones too.
     *
     * @return list<array<string, mixed>>
     */
    private function answeringValuesOf(TestStart $agent, string $inboxId): array
    {
        $target = new StackTarget($agent->agent->id, $agent->session->id);
        $stack = AgentStackRow::query()->withoutGlobalScopes()->forTarget($target)->sole();
        $answering = array_filter(
            $stack->frames->all(),
            fn (FrameRecord $frame) => $frame->reference->typeKey === AnsweringMessageStateReference::TYPE_KEY
                && $frame->reference->subject->id === $inboxId,
        );

        return array_values(array_map(
            fn (FrameRecord $frame) => [
                'waitingIds' => $frame->values['waitingIds'],
                'toolUses' => $frame->values['toolUses'],
                'refusedStops' => $frame->values['refusedStops'],
            ],
            $answering,
        ));
    }

    /**
     * The owner's open pages were told at least this many times, each time with the owner among those told.
     */
    private function assertOwnerPagesTold(int $atLeast): void
    {
        $toOwner = Event::dispatched(
            PageChanged::class,
            fn (PageChanged $change) => in_array($this->owner->id, $change->userIds, true),
        );

        $this->assertGreaterThanOrEqual($atLeast, $toOwner->count());
    }
}
