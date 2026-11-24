<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\Messages\AskChatQuestion\AskChatQuestionCommand;
use App\Commands\Messages\ReplyToMessage\ReplyToMessageCommand;
use App\Contracts\Chat\AgentMessageReader;
use App\Enums\ReadView;
use App\Support\ActorIdentity;
use App\Support\PendingInboxWork;
use Domain\Chat\Models\Conversation;
use Tests\Support\MessagingTestCase;
use Tests\Support\OpensPairChats;
use Tests\Support\ShowsMessageBatches;

/**
 * An agent in a pair sees the user's question as pending chat work with a claimable root, claims its turn, answers
 * once through the ordinary reply, acknowledges it and is left with no pending work.
 */
final class AgentChatFlowTest extends MessagingTestCase
{
    use OpensPairChats;
    use ShowsMessageBatches;

    private Conversation $chat;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chat = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder));
    }

    // An answer confirms what the agent was shown, so nothing is left to confirm after it.
    public function test_the_agent_claims_and_answers_and_has_no_pending_work_left(): void
    {
        $this->asOwner();
        $questionId = $this->runOnBus(new AskChatQuestionCommand($this->chat->inbox_id, 'Ready?', 'ask-key'));
        $pending = $this->app->make(PendingInboxWork::class);

        $this->asAgent($this->builder);
        $card = $this->app->make(AgentMessageReader::class)->message($questionId, ReadView::Summary)->message;

        $this->assertSame($questionId, $card->chat?->claimableRootId);
        $this->assertSame(1, $pending->pendingCount($this->actorOf($this->builder)));

        $this->runOnBus($this->claimSpeech($this->chat->inbox_id, $questionId));
        $this->runOnBus(new ReplyToMessageCommand($questionId, null, 'Yes.'));

        $this->assertSame(0, $pending->pendingCount($this->actorOf($this->builder)));
    }
}
