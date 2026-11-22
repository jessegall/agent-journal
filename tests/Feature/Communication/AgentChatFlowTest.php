<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\AskChatQuestion;
use App\Communication\Commands\ClaimSpeech;
use App\Communication\Commands\ReadMessages;
use App\Communication\Commands\ReplyToMessage;
use App\Communication\Contracts\AgentMessageReader;
use App\Communication\Support\PendingInboxWork;
use App\Reads\Enums\ReadView;
use Domain\Chat\Models\Conversation;
use Tests\Support\MessagingTestCase;
use Tests\Support\OpensPairChats;

/**
 * An agent in a pair sees the user's question as pending chat work with a claimable root, claims its turn, answers
 * once through the ordinary reply, acknowledges it and is left with no pending work.
 */
final class AgentChatFlowTest extends MessagingTestCase
{
    use OpensPairChats;

    private Conversation $chat;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chat = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder));
    }

    public function test_the_agent_claims_answers_acknowledges_and_has_no_pending_work_left(): void
    {
        $this->asOwner();
        $questionId = $this->runOnBus(new AskChatQuestion($this->chat->inbox_id, 'Ready?', 'ask-key'));
        $pending = $this->app->make(PendingInboxWork::class);

        $this->asAgent($this->builder);
        $card = $this->app->make(AgentMessageReader::class)->message($questionId, ReadView::Summary)->message;

        $this->assertSame($questionId, $card->chat?->claimableRootId);
        $this->assertSame(1, $pending->pendingCount($this->actorOf($this->builder)));

        $this->runOnBus(new ClaimSpeech($this->chat->inbox_id, $questionId));
        $this->runOnBus(new ReplyToMessage($questionId, null, 'Yes.'));
        $this->runOnBus(new ReadMessages($this->chat->inbox_id, [$questionId]));

        $this->assertSame(0, $pending->pendingCount($this->actorOf($this->builder)));
    }
}
