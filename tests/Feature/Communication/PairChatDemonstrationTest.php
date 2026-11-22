<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Contracts\ActorAttention;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\AttentionOrigin;
use App\Actors\Support\AttentionOutcome;
use App\Communication\Commands\AnswerChatQuestion;
use App\Communication\Commands\AskChatQuestion;
use App\Communication\Enums\MessageState;
use App\Communication\Exceptions\SpeechRefused;
use App\Communication\Models\Message;
use App\Communication\Models\MessageReceipt;
use App\Communication\Support\PendingInboxWork;
use App\Communication\Support\ReceiptDeliveries;
use Carbon\CarbonImmutable;
use Domain\Chat\Commands\OpenPairChat;
use Tests\Support\MessagingTestCase;
use Tests\Support\PresentsChatText;
use Tests\Support\TestIds;

/**
 * The first phase end to end: in a pair the user's question keeps the agent's one turn for it; the agent is woken
 * once, answers once under its live claim, and a stale token and a second answer are refused. Receipts are shown,
 * nobody has chat work left, unrelated desk mail still counts, and reopening the pair finds the same inbox.
 */
final class PairChatDemonstrationTest extends MessagingTestCase
{
    use PresentsChatText;

    private int $wakes = 0;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(ActorAttention::class, new class($this) implements ActorAttention
        {
            public function __construct(private PairChatDemonstrationTest $test) {}

            public function request(ActorIdentity $actor, AttentionOrigin $origin): AttentionOutcome
            {
                $this->test->countWake();

                return AttentionOutcome::accepted(TestIds::of(77), 1);
            }
        });
    }

    public function countWake(): void
    {
        $this->wakes++;
    }

    public function test_the_pair_question_is_answered_once_and_leaves_no_chat_work(): void
    {
        $this->asOwner();
        $inboxId = $this->runOnBus(new OpenPairChat($this->builder->agent_id));
        $questionId = $this->runOnBus(new AskChatQuestion($inboxId, 'Is the build green?', 'ask-1'));
        $pending = $this->app->make(PendingInboxWork::class);
        $agent = $this->actorOf($this->builder);

        $this->assertSame(1, $this->wakes);
        $this->assertSame(0, $pending->pendingCount(ActorIdentity::of($this->owner)));

        $this->asAgent($this->builder);
        $stale = $this->runOnBus($this->claimSpeech($inboxId, $questionId));
        $live = $this->runOnBus($this->claimSpeech($inboxId, $questionId));

        $this->assertThrows(
            fn () => $this->runOnBus(new AnswerChatQuestion($questionId, 'Yes.', 'answer-stale', $stale)),
            SpeechRefused::class,
        );

        $answerId = $this->runOnBus(new AnswerChatQuestion($questionId, 'Yes.', 'answer-1', $live));

        $this->assertThrows(
            fn () => $this->runOnBus(new AnswerChatQuestion($questionId, 'Still yes.', 'answer-2', $live)),
            SpeechRefused::class,
        );

        $this->presentAll($agent, $this->builder->id);
        $this->app->make(ReceiptDeliveries::class)->deliverDue(CarbonImmutable::now()->addDay());

        $question = Message::query()->acrossInboxes()->findOrFail($questionId);
        $this->assertSame([MessageState::Answered, $answerId], [$question->state, $question->answer_message_id]);
        $this->assertSame(0, MessageReceipt::query()->where('message_id', $questionId)->notPresented()->count());
        $this->assertSame(0, $pending->pendingCount($agent));
        $this->assertSame(1, $this->wakes);

        $this->asOwner();
        $this->ownerSends($this->inboxIdOf($this->builder), 'Unrelated desk mail.');
        $this->assertSame(1, $pending->pendingCount($agent));
        $this->assertSame($inboxId, $this->runOnBus(new OpenPairChat($this->builder->agent_id)));
    }
}
