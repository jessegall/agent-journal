<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Enums\ReceiptDeliveryState;
use App\Events\PageChanged;
use App\Models\Message;
use App\Models\MessageAttention;
use App\Models\MessageReceipt;
use App\Models\ReceiptDelivery;
use App\Support\ActorIdentity;
use App\Support\PresentationBatches;
use Carbon\CarbonImmutable;
use Domain\Chat\Commands\OpenPairChat\OpenPairChatCommand;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\MessagingTestCase;
use Tests\Support\SendsMcpFrames;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * One whole conversation as the journal sees it, through the doors a session really uses: the owner posts in the pair
 * chat, the agent is asked to wake, its driver is shown the text, the agent answers with one call of the journal's own
 * reply tool, which takes its turn and confirms what it was shown, and the owner's open pages are told each time
 * (rule 83; user messages 19571, 19640 and 19642: the answer once reached the chat and no open page heard of it).
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

        $shown = $this->app->make(PresentationBatches::class)->next(
            ActorIdentity::of($agent->agent),
            $agent->session->id,
            1,
            self::CONTEXT_KEY,
            CarbonImmutable::now(),
        );
        $this->assertNotNull($shown);

        $told = Event::dispatched(PageChanged::class)->count();

        // One call answers: it takes the agent's turn and confirms what its session was shown (user message 19690).
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
