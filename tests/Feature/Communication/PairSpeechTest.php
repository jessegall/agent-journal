<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\AnswerChatQuestion;
use App\Communication\Commands\AskChatQuestion;
use App\Communication\Commands\ClaimSpeech;
use App\Communication\Commands\PostChatMessage;
use App\Communication\Enums\MessageState;
use App\Communication\Enums\SpeechOpportunityState;
use App\Communication\Exceptions\MessageStateConflict;
use App\Communication\Exceptions\SpeechRefused;
use App\Communication\Models\Message;
use App\Communication\Models\SpeechOpportunity;
use Domain\Chat\Models\Conversation;
use Tests\Support\MessagingTestCase;
use Tests\Support\OpensPairChats;

/**
 * In a pair the user's question keeps the agent's one turn for it: an ordinary write under it is refused, the agent
 * answers once with its claim and the question closes once, and a token replaced by a later claim no longer holds.
 */
final class PairSpeechTest extends MessagingTestCase
{
    use OpensPairChats;

    private Conversation $chat;

    private string $questionId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chat = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder));
        $this->asOwner();
        $this->questionId = $this->runOnBus(new AskChatQuestion($this->chat->inbox_id, 'Ready?', 'question-key'));
        $this->asAgent($this->builder);
    }

    public function test_an_agent_cannot_write_without_a_claim_or_beside_its_reserved_question(): void
    {
        $this->assertThrows(
            fn () => $this->runOnBus(new PostChatMessage($this->chat->inbox_id, 'Hi.', 'no-claim')),
            SpeechRefused::class,
        );

        $token = $this->runOnBus(new ClaimSpeech($this->chat->inbox_id, $this->questionId));

        $this->assertThrows(
            fn () => $this->runOnBus(new PostChatMessage($this->chat->inbox_id, 'Hi.', 'beside', $token)),
            SpeechRefused::class,
        );
    }

    public function test_the_agent_answers_once_and_the_question_closes_once(): void
    {
        $token = $this->runOnBus(new ClaimSpeech($this->chat->inbox_id, $this->questionId));
        $answerId = $this->runOnBus(new AnswerChatQuestion($this->questionId, 'Yes.', 'answer-key', $token));

        $question = Message::query()->acrossInboxes()->findOrFail($this->questionId);
        $opportunity = SpeechOpportunity::query()->onRoot($this->questionId)->sole();

        $this->assertSame([MessageState::Answered, $answerId], [$question->state, $question->answer_message_id]);
        $this->assertSame([SpeechOpportunityState::Spent, $answerId], [
            $opportunity->state,
            $opportunity->contribution_message_id,
        ]);
        $this->assertThrows(
            fn () => $this->runOnBus(new AnswerChatQuestion($this->questionId, 'Again.', 'second-key', $token)),
            MessageStateConflict::class,
        );
    }

    public function test_a_token_replaced_by_a_later_claim_is_refused(): void
    {
        $old = $this->runOnBus(new ClaimSpeech($this->chat->inbox_id, $this->questionId));
        $new = $this->runOnBus(new ClaimSpeech($this->chat->inbox_id, $this->questionId));

        $this->assertThrows(
            fn () => $this->runOnBus(new AnswerChatQuestion($this->questionId, 'Late.', 'old-key', $old)),
            SpeechRefused::class,
        );

        $this->runOnBus(new AnswerChatQuestion($this->questionId, 'Now.', 'new-key', $new));
        $this->assertSame(2, SpeechOpportunity::query()->onRoot($this->questionId)->sole()->lease_version);
    }
}
