<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\AskChatQuestion\AskChatQuestionCommand;
use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Enums\IntervalRole;
use App\Exceptions\SpeechRefused;
use App\Models\Chats\SpeechOpportunity;
use App\Models\Messages\Message;
use App\Support\ActorIdentity;
use App\Support\ChatInboxes;
use App\Support\InboxIntervals;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Support\ChatInbox;
use Illuminate\Support\Str;
use Tests\Support\MessagingTestCase;
use Tests\Support\ShowsMessageBatches;

/**
 * Turns to speak in a room with two agents: a broadcast gives each agent one turn, a post addressed to one agent gives
 * only that agent a turn, and an agent asking the other either keeps the other's turn for its question or fails whole.
 */
final class GroupSpeechTest extends MessagingTestCase
{
    use ShowsMessageBatches;

    private string $inboxId;

    protected function setUp(): void
    {
        parent::setUp();

        $providerId = strtolower((string) Str::ulid());
        $this->inboxId = $this->app->make(ChatInboxes::class)->open($providerId);
        Conversation::create($this->inboxId, $providerId, ActorIdentity::of($this->owner), null, 'Design');
        $inbox = new ChatInbox($this->inboxId, 'Design');
        $intervals = $this->app->make(InboxIntervals::class);
        $intervals->enter($inbox, ActorIdentity::of($this->owner), IntervalRole::Owner);
        $intervals->enter($inbox, $this->actorOf($this->builder), IntervalRole::Member);
        $intervals->enter($inbox, $this->actorOf($this->reviewer), IntervalRole::Member);
    }

    public function test_a_broadcast_offers_each_agent_and_a_directed_post_only_its_target(): void
    {
        $this->asOwner();
        $broadcast = $this->runOnBus(new PostChatMessageCommand($this->inboxId, 'Thoughts?', 'all'));
        $directed = $this->runOnBus(
            new PostChatMessageCommand($this->inboxId, 'Builder, please.', 'one', null, "agent:{$this->builder->agent_id}"),
        );

        $this->assertSame(2, SpeechOpportunity::query()->onRoot($broadcast)->count());
        $this->assertSame(
            [$this->builder->agent_id],
            SpeechOpportunity::query()->onRoot($directed)->pluck('actor_id')->all(),
        );
    }

    public function test_an_agent_question_to_the_other_agent_keeps_its_turn_or_fails_whole(): void
    {
        $this->asOwner();
        $root = $this->runOnBus(new PostChatMessageCommand($this->inboxId, 'Thoughts?', 'all'));

        $this->asAgent($this->builder);
        $builderToken = $this->runOnBus($this->claimSpeech($this->inboxId, $root));
        $ask = new AskChatQuestionCommand(
            $this->inboxId,
            'Reviewer, agree?',
            'ask',
            "agent:{$this->reviewer->agent_id}",
            $builderToken,
        );

        $this->asAgent($this->reviewer);
        $this->runOnBus($this->claimSpeech($this->inboxId, $root));

        $this->asAgent($this->builder);
        $this->assertThrows(fn () => $this->runOnBus($ask), SpeechRefused::class);
        $this->assertSame(0, Message::query()->acrossInboxes()->where('body', 'Reviewer, agree?')->count());
    }
}
