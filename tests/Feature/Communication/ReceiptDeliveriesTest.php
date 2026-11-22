<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Contracts\ActorAttention;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\AttentionOrigin;
use App\Actors\Support\AttentionOutcome;
use App\Bus\Models\CommandReceipt;
use App\Bus\Support\ReceiptCaller;
use App\Bus\Support\ReceiptRetention;
use App\Communication\Enums\IntervalRole;
use App\Communication\Enums\ReceiptDeliveryState;
use App\Communication\Models\InboxInterval;
use App\Communication\Models\InboxRecord;
use App\Communication\Models\Message;
use App\Communication\Models\MessageReceipt;
use App\Communication\Models\ReceiptDelivery;
use App\Communication\Support\AcceptedOperation;
use App\Communication\Support\MessageBody;
use App\Communication\Support\MessageEnvelope;
use App\Communication\Support\ReceiptDeliveries;
use App\Desks\Support\DeskOpening;
use App\Numbers\Models\GlobalGroup;
use Carbon\CarbonImmutable;
use RuntimeException;
use stdClass;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A chat message wakes each agent member once and stays open until its text is presented: a user member gets no
 * delivery, an agent that runs nowhere waits for its startup, a failing wake retries until it is exhausted, and a
 * receipt already shown settles its delivery without another wake.
 */
final class ReceiptDeliveriesTest extends TestCase
{
    use RefreshHookDatabase;

    private ActorIdentity $agent;

    private ActorIdentity $user;

    private InboxRecord $inbox;

    /**
     * @var list<AttentionOutcome|RuntimeException>
     */
    private array $outcomes = [];

    private int $requests = 0;

    protected function setUp(): void
    {
        parent::setUp();

        GlobalGroup::installJournal();
        $this->agent = TestActors::agentIdentity(7);
        $this->user = TestActors::userIdentity(8);
        $this->inbox = InboxRecord::create('test-chat', (string) str()->ulid());
        $this->app->instance(ActorAttention::class, new class($this) implements ActorAttention
        {
            public function __construct(private ReceiptDeliveriesTest $test) {}

            public function request(ActorIdentity $actor, AttentionOrigin $origin): AttentionOutcome
            {
                return $this->test->nextOutcome();
            }
        });
    }

    public function nextOutcome(): AttentionOutcome
    {
        $this->requests++;
        $outcome = array_shift($this->outcomes) ?? AttentionOutcome::accepted(TestIds::of(99), 1);

        if ($outcome instanceof RuntimeException) {
            throw $outcome;
        }

        return $outcome;
    }

    public function test_an_agent_is_woken_once_and_a_user_gets_no_delivery(): void
    {
        $this->post();

        $this->assertSame(1, $this->requests);
        $this->assertSame(1, ReceiptDelivery::query()->count());
        $this->assertSame(ReceiptDeliveryState::Pending, ReceiptDelivery::query()->sole()->state);
    }

    public function test_an_agent_without_a_runtime_waits_for_its_startup(): void
    {
        $this->outcomes = [AttentionOutcome::noRuntime()];

        $this->post();

        $delivery = ReceiptDelivery::query()->sole();
        $this->assertSame([ReceiptDeliveryState::Waiting, 0], [$delivery->state, $delivery->attempts]);
    }

    public function test_a_failing_wake_retries_and_is_exhausted_after_five_tries(): void
    {
        $this->outcomes = array_fill(0, 5, new RuntimeException('runtime refused'));

        $this->post();

        $deliveries = $this->app->make(ReceiptDeliveries::class);

        foreach (range(1, 4) as $pass) {
            $deliveries->deliverDue(CarbonImmutable::now()->addDay()->addMinutes($pass));
        }

        $delivery = ReceiptDelivery::query()->sole();
        $this->assertSame([ReceiptDeliveryState::Exhausted, 5], [$delivery->state, $delivery->attempts]);
        $this->assertSame('runtime refused', $delivery->last_failure);
    }

    public function test_a_presented_receipt_settles_its_delivery_and_is_not_woken_again(): void
    {
        $this->outcomes = [new RuntimeException('runtime refused')];

        $this->post();

        MessageReceipt::query()->whereKey(ReceiptDelivery::query()->sole()->receipt_id)->sole()
            ->present(CarbonImmutable::now());
        $this->app->make(ReceiptDeliveries::class)->deliverDue(CarbonImmutable::now()->addDay());

        $this->assertSame(1, $this->requests);
        $this->assertSame(ReceiptDeliveryState::Accepted, ReceiptDelivery::query()->sole()->state);
    }

    /**
     * The user posts a message reaching itself and the agent, and its receipts are scheduled.
     */
    private function post(): void
    {
        $sender = InboxInterval::open($this->inbox->id, $this->user, IntervalRole::Owner, 1);
        $member = InboxInterval::open($this->inbox->id, $this->agent, IntervalRole::Member, 2);
        $message = $this->message();

        MessageReceipt::forAudience($message, [$sender, $member], $sender->id);

        $receipts = MessageReceipt::query()->where('message_id', $message->id)->get()->all();
        $this->app->make(ReceiptDeliveries::class)->schedule(array_values($receipts));
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
            $this->user,
            MessageBody::from('Hello.'),
        );

        return Message::create($envelope, new AcceptedOperation($receipt->id));
    }
}
