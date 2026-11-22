<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\AcknowledgePresentation;
use App\Communication\Commands\PostChatMessage;
use App\Communication\Commands\ReadMessages;
use App\Communication\Models\MessageReceipt;
use App\Communication\Support\PresentationBatches;
use Carbon\CarbonImmutable;
use Domain\Chat\Models\Conversation;
use Tests\Support\MessagingTestCase;
use Tests\Support\OpensPairChats;

/**
 * A long chat post becomes read for an agent only once its driver confirmed the whole body in one context: half of
 * it leaves it unread at its offset, an ordinary read changes nothing, another context starts again at zero, and a
 * handle of another batch is ignored.
 */
final class PresentationAcknowledgementTest extends MessagingTestCase
{
    use OpensPairChats;

    private Conversation $chat;

    private string $messageId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chat = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder));
        $this->asOwner();
        $this->messageId = $this->runOnBus(
            new PostChatMessage($this->chat->inbox_id, str_repeat('a', 12000), 'long'),
        );
        $this->asAgent($this->builder);
    }

    public function test_half_a_body_stays_unread_and_the_rest_in_the_same_context_presents_it(): void
    {
        $batches = $this->app->make(PresentationBatches::class);
        $agent = $this->actorOf($this->builder);

        $first = $batches->next($agent, $this->builder->id, 1, 'thread-1', CarbonImmutable::now());
        $this->runOnBus(new AcknowledgePresentation($first->batchId, [$first->items[0]->handle], 'thread-1'));
        $this->runOnBus(new ReadMessages($this->chat->inbox_id, [$this->messageId]));

        $this->assertFalse($this->receipt()->isPresented());

        $elsewhere = $batches->next($agent, $this->builder->id, 1, 'terminal-1', CarbonImmutable::now());
        $this->assertSame(0, $elsewhere->items[0]->startOffset);

        $rest = $batches->next($agent, $this->builder->id, 1, 'thread-1', CarbonImmutable::now());
        $this->assertSame(PresentationBatches::CHARACTER_LIMIT, $rest->items[0]->startOffset);

        $stray = new AcknowledgePresentation($rest->batchId, [$elsewhere->items[0]->handle], 'thread-1');
        $this->assertSame(0, $this->runOnBus($stray));
        $this->runOnBus(new AcknowledgePresentation($rest->batchId, [$rest->items[0]->handle], 'thread-1'));

        $this->assertTrue($this->receipt()->isPresented());
    }

    private function receipt(): MessageReceipt
    {
        return MessageReceipt::query()
            ->where('message_id', $this->messageId)
            ->whereIn('interval_id', fn ($intervals) => $intervals
                ->select('id')
                ->from('inbox_intervals')
                ->where('actor_id', $this->builder->agent_id))
            ->sole();
    }
}
