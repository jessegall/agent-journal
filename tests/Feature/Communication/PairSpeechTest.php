<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\AnswerChatQuestion\AnswerChatQuestionCommand;
use App\Commands\AskChatQuestion\AskChatQuestionCommand;
use App\Commands\ClaimSpeech\ClaimSpeechCommand;
use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Enums\MessageState;
use App\Enums\SpeechOpportunityState;
use App\Exceptions\SpeechRefused;
use App\Models\Message;
use App\Models\SpeechOpportunity;
use App\Support\ActorIdentity;
use Domain\Chat\Models\Conversation;
use Tests\Support\MessagingTestCase;
use Tests\Support\OpensPairChats;
use Tests\Support\PresentsChatText;

/**
 * In a pair the user's question keeps the agent's one turn for it: an ordinary write under it is refused, the agent
 * answers once with its claim and the question closes once, and a token replaced by a later claim no longer holds.
 */
final class PairSpeechTest extends MessagingTestCase
{
    use OpensPairChats;
    use PresentsChatText;

    private Conversation $chat;

    private string $questionId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chat = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder));
        $this->asOwner();
        $this->questionId = $this->runOnBus(new AskChatQuestionCommand($this->chat->inbox_id, 'Ready?', 'question-key'));
        $this->asAgent($this->builder);
    }

    public function test_an_agent_cannot_write_without_a_claim_or_beside_its_reserved_question(): void
    {
        $this->assertThrows(
            fn () => $this->runOnBus(new PostChatMessageCommand($this->chat->inbox_id, 'Hi.', 'no-claim')),
            SpeechRefused::class,
        );

        $token = $this->runOnBus($this->claimSpeech($this->chat->inbox_id, $this->questionId));

        $this->assertThrows(
            fn () => $this->runOnBus(new PostChatMessageCommand($this->chat->inbox_id, 'Hi.', 'beside', $token)),
            SpeechRefused::class,
        );
    }

    public function test_the_agent_answers_once_and_the_question_closes_once(): void
    {
        $token = $this->runOnBus($this->claimSpeech($this->chat->inbox_id, $this->questionId));
        $answerId = $this->runOnBus(new AnswerChatQuestionCommand($this->questionId, 'Yes.', 'answer-key', $token));

        $question = Message::query()->acrossInboxes()->findOrFail($this->questionId);
        $opportunity = SpeechOpportunity::query()->onRoot($this->questionId)->sole();

        $this->assertSame([MessageState::Answered, $answerId], [$question->state, $question->answer_message_id]);
        $this->assertSame([SpeechOpportunityState::Spent, $answerId], [
            $opportunity->state,
            $opportunity->contribution_message_id,
        ]);
        $this->assertThrows(
            fn () => $this->runOnBus(new AnswerChatQuestionCommand($this->questionId, 'Again.', 'second-key', $token)),
            SpeechRefused::class,
        );
    }

    public function test_a_token_replaced_by_a_later_claim_is_refused(): void
    {
        $old = $this->runOnBus($this->claimSpeech($this->chat->inbox_id, $this->questionId));
        $new = $this->runOnBus($this->claimSpeech($this->chat->inbox_id, $this->questionId));

        $this->assertThrows(
            fn () => $this->runOnBus(new AnswerChatQuestionCommand($this->questionId, 'Late.', 'old-key', $old)),
            SpeechRefused::class,
        );

        $this->runOnBus(new AnswerChatQuestionCommand($this->questionId, 'Now.', 'new-key', $new));
        $this->assertSame(2, SpeechOpportunity::query()->onRoot($this->questionId)->sole()->lease_version);
    }

    public function test_a_claim_without_its_turns_grant_or_from_another_batch_is_refused(): void
    {
        $this->assertThrows(
            fn () => $this->runOnBus(new ClaimSpeechCommand($this->chat->inbox_id, $this->questionId, '', '')),
            SpeechRefused::class,
        );

        $earlier = $this->claimSpeech($this->chat->inbox_id, $this->questionId);
        $later = $this->claimSpeech($this->chat->inbox_id, $this->questionId);

        $this->assertThrows(
            fn () => $this->runOnBus(new ClaimSpeechCommand(
                $this->chat->inbox_id,
                $this->questionId,
                $later->batchId,
                $earlier->grant,
            )),
            SpeechRefused::class,
        );
    }
}
