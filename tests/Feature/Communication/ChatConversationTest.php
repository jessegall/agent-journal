<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Data\PresentationItemData;
use App\Events\PageChanged;
use App\Models\Message;
use App\Models\MessageAttention;
use App\Models\MessageReceipt;
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
 * chat, the agent is asked to wake, its driver is shown the text, the agent claims its turn, answers and confirms what
 * it was shown through the journal's own tools, and the owner's open pages are told of the post and of the answer
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

        $this->useTool($agent, 'messages_claim', [
            'inbox_id' => $inboxId,
            'root_id' => $questionId,
            'batch_id' => $shown->batchId,
            'claim_grant' => $shown->claimGrant,
            'request_key' => 'agent-claims',
        ]);
        $told = Event::dispatched(PageChanged::class)->count();

        $answerId = $this->useTool($agent, 'messages_reply', [
            'message_id' => $questionId,
            'body' => '2 plus 2 is 4.',
            'request_key' => 'agent-answers',
        ])['message_id'];

        $this->assertOwnerPagesTold($told + 1);
        $this->useTool($agent, 'messages_acknowledge_presented', [
            'batch_id' => $shown->batchId,
            'handles' => array_map(fn (PresentationItemData $item) => $item->handle, $shown->items),
            'context_key' => self::CONTEXT_KEY,
            'request_key' => 'agent-confirms',
        ]);

        $answer = Message::query()->acrossInboxes()->findOrFail($answerId);
        $this->assertSame([$questionId, $inboxId], [$answer->reply_to_id, $answer->destination_inbox_id]);
        $this->assertSame(0, MessageReceipt::query()->where('message_id', $questionId)->notPresented()->count());
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
