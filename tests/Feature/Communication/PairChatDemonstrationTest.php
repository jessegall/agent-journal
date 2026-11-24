<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\Messages\AnswerChatQuestion\AnswerChatQuestionCommand;
use App\Commands\Messages\AskChatQuestion\AskChatQuestionCommand;
use App\Contracts\Actors\ActorAttention;
use App\Enums\MessageState;
use App\Events\Web\PageChanged;
use App\Exceptions\SpeechRefused;
use App\Models\Messages\Message;
use App\Models\Messages\MessageReceipt;
use App\Support\ActorIdentity;
use App\Support\AttentionOrigin;
use App\Support\AttentionOutcome;
use App\Support\PendingInboxWork;
use App\Support\ReceiptDeliveryService;
use Carbon\CarbonImmutable;
use Domain\Chat\Commands\OpenPairChat\OpenPairChatCommand;
use Illuminate\Support\Facades\Event;
use Tests\Support\MessagingTestCase;
use Tests\Support\ShowsMessageBatches;
use Tests\Support\TestIds;

/**
 * The first phase end to end: in a pair the user's question keeps the agent's one turn for it; the agent is woken
 * once, answers once under its live claim, and a stale token and a second answer are refused. Receipts are shown,
 * nobody has chat work left, unrelated desk mail still counts, and reopening the pair finds the same inbox.
 */
final class PairChatDemonstrationTest extends MessagingTestCase
{
    use ShowsMessageBatches;

    private int $wakes = 0;

    protected function setUp(): void
    {
        parent::setUp();

        $attention = new class($this) implements ActorAttention
        {
            public function __construct(private PairChatDemonstrationTest $test) {}

            public function request(ActorIdentity $actor, AttentionOrigin $origin): AttentionOutcome
            {
                $this->test->countWake();

                return AttentionOutcome::accepted(TestIds::of(77), 1);
            }
        };
        $this->app->scoped(ActorAttention::class, fn () => $attention);
    }

    public function countWake(): void
    {
        $this->wakes++;
    }

    public function test_the_pair_question_is_answered_once_and_leaves_no_chat_work(): void
    {
        $this->asOwner();
        $inboxId = $this->runOnBus(new OpenPairChatCommand($this->builder->agent_id));
        $questionId = $this->runOnBus(new AskChatQuestionCommand($inboxId, 'Is the build green?', 'ask-1'));
        $pending = $this->app->make(PendingInboxWork::class);
        $agent = $this->actorOf($this->builder);

        $this->assertSame(1, $this->wakes);
        $this->assertSame(0, $pending->pendingCount(ActorIdentity::of($this->owner)));

        $this->asAgent($this->builder);
        $stale = $this->runOnBus($this->claimSpeech($inboxId, $questionId));
        $live = $this->runOnBus($this->claimSpeech($inboxId, $questionId));

        $this->assertThrows(
            fn () => $this->runOnBus(new AnswerChatQuestionCommand($questionId, 'Yes.', 'answer-stale', $stale)),
            SpeechRefused::class,
        );

        $answerId = $this->runOnBus(new AnswerChatQuestionCommand($questionId, 'Yes.', 'answer-1', $live));

        $this->assertThrows(
            fn () => $this->runOnBus(new AnswerChatQuestionCommand($questionId, 'Still yes.', 'answer-2', $live)),
            SpeechRefused::class,
        );

        $this->showAll($agent, $this->builder->id);
        $this->app->make(ReceiptDeliveryService::class)->deliverDue(CarbonImmutable::now()->addDay());

        $question = Message::query()->acrossInboxes()->findOrFail($questionId);
        $this->assertSame([MessageState::Answered, $answerId], [$question->state, $question->answer_message_id]);
        $this->assertSame(0, MessageReceipt::query()->where('message_id', $questionId)->notPresented()->count());
        $this->assertSame(0, $pending->pendingCount($agent));
        $this->assertSame(1, $this->wakes);

        $this->asOwner();
        $this->ownerSends($this->inboxIdOf($this->builder), 'Unrelated desk mail.');
        $this->assertSame(1, $pending->pendingCount($agent));
        $this->assertSame($inboxId, $this->runOnBus(new OpenPairChatCommand($this->builder->agent_id)));
    }

    // The agent answered, and the open chat showed nothing until a reload, because no
    // page was told of a chat fact. The answer reaches the owner's open pages by itself.
    public function test_an_agents_answer_in_a_pair_chat_tells_the_owners_open_pages(): void
    {
        $this->asOwner();
        $inboxId = $this->runOnBus(new OpenPairChatCommand($this->builder->agent_id));
        $questionId = $this->runOnBus(new AskChatQuestionCommand($inboxId, 'Is the build green?', 'ask-1'));
        $this->asAgent($this->builder);
        $speech = $this->runOnBus($this->claimSpeech($inboxId, $questionId));
        Event::fake([PageChanged::class]);

        $this->runOnBus(new AnswerChatQuestionCommand($questionId, 'Yes.', 'answer-1', $speech));

        Event::assertDispatched(
            PageChanged::class,
            fn (PageChanged $change) => in_array($this->owner->id, $change->userIds, true),
        );
    }
}
