<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Bus\Models\CommandReceipt;
use App\Bus\Support\ReceiptCaller;
use App\Bus\Support\ReceiptRetention;
use App\Communication\Enums\IntervalRole;
use App\Communication\Enums\ReceiptDeliveryState;
use App\Communication\Enums\SpeechOpportunityState;
use App\Communication\Enums\TimelineEventType;
use App\Communication\Exceptions\ChatStateConflict;
use App\Communication\Models\InboxInterval;
use App\Communication\Models\InboxRecord;
use App\Communication\Models\Message;
use App\Communication\Models\MessageReceipt;
use App\Communication\Models\ReceiptDelivery;
use App\Communication\Models\SpeechOpportunity;
use App\Communication\Models\TimelineEvent;
use App\Communication\Support\AcceptedOperation;
use App\Communication\Support\MessageBody;
use App\Communication\Support\MessageEnvelope;
use App\Desks\Support\DeskOpening;
use App\Numbers\Models\GlobalGroup;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;
use stdClass;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The chat rows of Core: an inbox hands out each timeline position once, an actor holds one active interval per
 * inbox, a receipt is presented once, and deliveries and speech opportunities move only forward through their states.
 */
final class ChatCoreModelsTest extends TestCase
{
    use RefreshHookDatabase;

    private ActorIdentity $agent;

    private InboxRecord $inbox;

    protected function setUp(): void
    {
        parent::setUp();

        GlobalGroup::installJournal();
        $this->agent = TestActors::agentIdentity(7);
        $this->inbox = InboxRecord::create('test-chat', (string) str()->ulid());
    }

    public function test_the_inbox_hands_out_each_sequence_once_in_order(): void
    {
        $first = InboxRecord::lockForSequence($this->inbox->id);
        $second = InboxRecord::lockForSequence($this->inbox->id);

        $this->assertSame([1, 2], [$first, $second]);
        $this->assertSame(2, $this->inbox->refresh()->next_sequence);
    }

    public function test_an_actor_holds_one_active_interval_per_inbox_and_may_rejoin_after_leaving(): void
    {
        $interval = InboxInterval::open($this->inbox->id, $this->agent, IntervalRole::Member, 1);
        TimelineEvent::append($this->inbox->id, 1, TimelineEventType::Joined, $this->agent, $interval->id);

        $this->assertThrows(
            fn () => InboxInterval::open($this->inbox->id, $this->agent, IntervalRole::Member, 2),
            QueryException::class,
        );

        $interval->end('left', CarbonImmutable::now());
        $rejoined = InboxInterval::open($this->inbox->id, $this->agent, IntervalRole::Owner, 3);

        $this->assertFalse($interval->isActive());
        $this->assertTrue($rejoined->isActive());
        $this->assertSame(1, InboxInterval::query()->activeFor($this->inbox->id)->heldBy($this->agent)->count());
        $this->assertThrows(fn () => $interval->end('left', CarbonImmutable::now()), ChatStateConflict::class);
        $this->assertThrows(
            fn () => TimelineEvent::append($this->inbox->id, 1, TimelineEventType::Left, $this->agent, null),
            QueryException::class,
        );
    }

    public function test_a_receipt_is_presented_once_and_the_senders_receipt_starts_presented(): void
    {
        $message = $this->message();
        $sender = InboxInterval::open($this->inbox->id, $this->agent, IntervalRole::Owner, 1);
        $reader = InboxInterval::open($this->inbox->id, TestActors::agentIdentity(8), IntervalRole::Member, 1);

        MessageReceipt::forAudience($message, [$sender, $reader], $sender->id);

        $senderReceipt = MessageReceipt::query()->ofInterval($sender->id)->firstOrFail();
        $readerReceipt = MessageReceipt::query()->ofInterval($reader->id)->firstOrFail();

        $this->assertTrue($senderReceipt->isPresented());
        $this->assertTrue($readerReceipt->present(CarbonImmutable::now()));
        $this->assertFalse($readerReceipt->present(CarbonImmutable::now()->addMinute()));
    }

    public function test_a_delivery_retries_then_is_exhausted_and_refuses_further_change(): void
    {
        $interval = InboxInterval::open($this->inbox->id, $this->agent, IntervalRole::Member, 1);
        MessageReceipt::forAudience($this->message(), [$interval], TestIds::of(9));
        $delivery = ReceiptDelivery::pending(MessageReceipt::query()->ofInterval($interval->id)->firstOrFail());

        $delivery->fail('runtime away', CarbonImmutable::now()->addMinute());
        $delivery->exhaust('runtime away');

        $this->assertSame([ReceiptDeliveryState::Exhausted, 2], [$delivery->state, $delivery->attempts]);
        $this->assertThrows(fn () => $delivery->accept(), ChatStateConflict::class);
    }

    public function test_an_opportunity_is_claimed_under_a_rising_lease_and_spent_once(): void
    {
        $root = $this->message();
        $interval = InboxInterval::open($this->inbox->id, $this->agent, IntervalRole::Member, 1);
        $opportunity = SpeechOpportunity::offer($root, $this->agent, $interval);
        $now = CarbonImmutable::now();

        $opportunity->claim(hash('sha256', 'first'), $now->addMinute());
        $opportunity->claim(hash('sha256', 'second'), $now->addMinute());

        $this->assertSame(2, $opportunity->lease_version);
        $this->assertFalse($opportunity->isLeasedTo(hash('sha256', 'first'), $now));
        $this->assertTrue($opportunity->isLeasedTo(hash('sha256', 'second'), $now));

        $opportunity->spend($this->message());

        $this->assertSame(SpeechOpportunityState::Spent, $opportunity->refresh()->state);
        $this->assertThrows(fn () => $opportunity->decline(), ChatStateConflict::class);
        $this->assertThrows(
            fn () => SpeechOpportunity::offer($root, $this->agent, $interval),
            QueryException::class,
        );
    }

    private function message(): Message
    {
        $receipt = CommandReceipt::create(
            ReceiptCaller::withoutSession(ActorContext::forAgent(TestIds::of(7))),
            (string) str()->ulid(),
            new stdClass(),
            ReceiptRetention::standard(),
        );
        $envelope = MessageEnvelope::send(
            $this->app->make(DeskOpening::class)->openSourceDesk((string) str()->ulid(), 'From'),
            $this->app->make(DeskOpening::class)->openSourceDesk((string) str()->ulid(), 'To'),
            $this->agent,
            MessageBody::from('Hello.'),
        );

        return Message::create($envelope, new AcceptedOperation($receipt->id));
    }
}
