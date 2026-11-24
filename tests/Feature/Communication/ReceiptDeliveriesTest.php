<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Contracts\Actors\ActorAttention;
use App\Enums\IntervalRole;
use App\Enums\ReceiptDeliveryState;
use App\Models\Chats\InboxInterval;
use App\Models\Inboxes\Inbox;
use App\Models\CommandRules\CommandReceipt;
use App\Models\Messages\Message;
use App\Models\Messages\MessageReceipt;
use App\Models\Messages\ReceiptDelivery;
use App\Models\Records\GlobalGroup;
use App\Support\AcceptedOperation;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\AttentionOrigin;
use App\Support\AttentionOutcome;
use App\Support\DeskService;
use App\Support\MessageBody;
use App\Support\MessageEnvelope;
use App\Support\ReceiptCaller;
use App\Support\ReceiptDeliveryService;
use App\Support\ReceiptRetention;
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

    private const string REFUSAL = 'runtime refused';

    private ActorIdentity $agent;

    private ActorIdentity $user;

    private Inbox $inbox;

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
        $this->inbox = Inbox::create('test-chat', (string) str()->ulid());
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
        $this->postToTheChat();

        $this->assertSame(1, $this->requests);
        $this->assertSame(1, ReceiptDelivery::query()->count());
        $this->assertSame(ReceiptDeliveryState::Pending, ReceiptDelivery::query()->sole()->state);
    }

    public function test_an_agent_without_a_runtime_waits_for_its_startup(): void
    {
        $this->outcomes = [AttentionOutcome::noRuntime()];

        $this->postToTheChat();

        $delivery = ReceiptDelivery::query()->sole();
        $this->assertSame([ReceiptDeliveryState::Waiting, 0], [$delivery->state, $delivery->attempts]);
    }

    public function test_a_failing_wake_retries_and_is_exhausted_after_five_tries(): void
    {
        $this->outcomes = array_fill(0, 5, new RuntimeException(self::REFUSAL));

        $this->postToTheChat();

        $deliveries = $this->app->make(ReceiptDeliveryService::class);

        foreach (range(1, 4) as $pass) {
            $deliveries->deliverDue(CarbonImmutable::now()->addDays($pass));
        }

        $delivery = ReceiptDelivery::query()->sole();
        $this->assertSame([ReceiptDeliveryState::Exhausted, 5], [$delivery->state, $delivery->attempts]);
        $this->assertSame(self::REFUSAL, $delivery->last_failure);
    }

    public function test_a_presented_receipt_settles_its_delivery_and_is_not_woken_again(): void
    {
        $this->outcomes = [new RuntimeException(self::REFUSAL)];

        $this->postToTheChat();

        MessageReceipt::query()->whereKey(ReceiptDelivery::query()->sole()->receipt_id)->sole()
            ->present(CarbonImmutable::now());
        $this->app->make(ReceiptDeliveryService::class)->deliverDue(CarbonImmutable::now()->addDay());

        $this->assertSame(1, $this->requests);
        $this->assertSame(ReceiptDeliveryState::Accepted, ReceiptDelivery::query()->sole()->state);
    }

    /**
     * The user posts a message reaching itself and the agent, and its receipts are scheduled.
     */
    private function postToTheChat(): void
    {
        $sender = InboxInterval::create($this->inbox->id, $this->user, IntervalRole::Owner, 1);
        $member = InboxInterval::create($this->inbox->id, $this->agent, IntervalRole::Member, 2);
        $message = $this->message();

        $receipts = MessageReceipt::forAudience($message, [$sender, $member], $sender->id);
        $this->app->make(ReceiptDeliveryService::class)->schedule($receipts);
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
            $this->app->make(DeskService::class)->openSourceDesk((string) str()->ulid(), 'From'),
            $this->app->make(DeskService::class)->openSourceDesk((string) str()->ulid(), 'To'),
            $this->user,
            MessageBody::from('Hello.'),
        );

        return Message::create($envelope, new AcceptedOperation($receipt->id));
    }
}
