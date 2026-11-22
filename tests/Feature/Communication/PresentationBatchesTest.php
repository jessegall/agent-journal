<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Contracts\CurrentActorSetter;
use App\Enums\IntervalRole;
use App\Models\CommandReceipt;
use App\Models\GlobalGroup;
use App\Models\InboxInterval;
use App\Models\Message;
use App\Models\MessageReceipt;
use App\Support\AcceptedOperation;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\ChatInboxes;
use App\Support\DeskOpening;
use App\Support\MessageBody;
use App\Support\MessageEnvelope;
use App\Support\PresentationBatches;
use App\Support\ReceiptCaller;
use App\Support\ReceiptRetention;
use App\Support\SystemActor;
use App\Values\TrustedEntryAuthority;
use Carbon\CarbonImmutable;
use Domain\Chat\Models\Conversation;
use stdClass;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * An agent in two chats gets bounded batches that take turns between them, and a long post arrives in pieces.
 */
final class PresentationBatchesTest extends TestCase
{
    use RefreshHookDatabase;

    private ActorIdentity $agent;

    protected function setUp(): void
    {
        parent::setUp();

        GlobalGroup::installJournal();
        $this->agent = TestActors::agentIdentity(7);
        $this->app->make(CurrentActorSetter::class)->set(new SystemActor(), new TrustedEntryAuthority('host request'));
    }

    public function test_batches_take_turns_between_chats_and_stay_within_twenty_posts(): void
    {
        $design = $this->chatWith(15, 'Short post.');
        $release = $this->chatWith(15, 'Short post.');
        $batches = $this->app->make(PresentationBatches::class);
        $now = CarbonImmutable::now();

        $first = $batches->next($this->agent, TestIds::of(5), 1, 'thread-1', $now);
        $second = $batches->next($this->agent, TestIds::of(5), 1, 'thread-1', $now->addSecond());

        $this->assertNotNull($first);
        $this->assertNotNull($second);
        $this->assertLessThanOrEqual(PresentationBatches::POST_LIMIT, count($first->items));
        $this->assertNotSame($first->inboxId, $second->inboxId);
        $this->assertContains($first->inboxId, [$design, $release]);
    }

    public function test_a_long_post_arrives_in_pieces_within_the_character_budget(): void
    {
        $this->chatWith(1, str_repeat('a', 20000));

        $batch = $this->app->make(PresentationBatches::class)
            ->next($this->agent, TestIds::of(5), 1, 'thread-1', CarbonImmutable::now());

        $this->assertNotNull($batch);
        $this->assertSame(0, $batch->items[0]->startOffset);
        $this->assertSame(PresentationBatches::CHARACTER_LIMIT, $batch->items[0]->endOffset);
        $this->assertSame(20000, $batch->items[0]->bodyLength);
    }

    /**
     * A chat the agent is in with the given number of posts it has not been shown; answers the chat's inbox id.
     */
    private function chatWith(int $posts, string $body): string
    {
        $providerId = (string) str()->ulid();
        $inboxId = $this->app->make(ChatInboxes::class)->open($providerId);
        Conversation::create($inboxId, $providerId, TestActors::userIdentity(1), null, 'Chat');
        $interval = InboxInterval::create($inboxId, $this->agent, IntervalRole::Member, 1);

        foreach (range(1, $posts) as $post) {
            MessageReceipt::forAudience($this->message($body), [$interval], TestIds::of(9));
        }

        return $inboxId;
    }

    private function message(string $body): Message
    {
        $operation = CommandReceipt::create(
            ReceiptCaller::withoutSession(ActorContext::forAgent(TestIds::of(8))),
            (string) str()->ulid(),
            new stdClass(),
            ReceiptRetention::standard(),
        );
        $envelope = MessageEnvelope::send(
            $this->app->make(DeskOpening::class)->openSourceDesk((string) str()->ulid(), 'From'),
            $this->app->make(DeskOpening::class)->openSourceDesk((string) str()->ulid(), 'To'),
            TestActors::agentIdentity(8),
            MessageBody::from($body),
        );

        return Message::create($envelope, new AcceptedOperation($operation->id));
    }
}
