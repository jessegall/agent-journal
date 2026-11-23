<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActorAttention;
use App\Contracts\Bus\CommandFacts;
use App\Contracts\Work\UnitOfWork;
use App\Events\ReceiptDeliveriesScheduled;
use App\Models\Message;
use App\Models\MessageAttention;
use App\Models\MessageReceipt;
use App\Models\ReceiptDelivery;
use Carbon\CarbonImmutable;
use Illuminate\Database\ConnectionInterface;
use RuntimeException;

/**
 * Wakes the agent members a chat message reached, one delivery per receipt: tried once the message commits and again
 * by the minute's pass, retried later after a failure and given up after five. A user's receipt is shown by the
 * window and needs no delivery; a receipt already shown or a member who left is never woken.
 */
final readonly class ReceiptDeliveries
{
    public const int ALLOWED_TRIES = 5;

    public const int PASS_LIMIT = 50;

    private const int FAILURE_LENGTH = 255;

    private const int FIRST_BACKOFF_SECONDS = 15;

    private const int LONGEST_BACKOFF_SECONDS = 900;

    private const string UNIT_OWNER = 'a receipt delivery';

    public function __construct(
        private ActorAttention $attention,
        private CommandFacts $facts,
        private ConnectionInterface $database,
        private UnitOfWork $unitOfWork,
    ) {}

    /**
     * Gives each agent receipt not yet shown its delivery, in the accepting transaction, and wakes them after commit.
     *
     * @param  list<MessageReceipt>  $receipts
     */
    public function schedule(array $receipts): void
    {
        $deliveryIds = [];

        foreach ($receipts as $receipt) {
            if ($receipt->isPresented() || ! $receipt->interval->actor->type->isAgent()) {
                continue;
            }

            $deliveryIds[] = ReceiptDelivery::create($receipt)->id;
        }

        if ($deliveryIds === []) {
            return;
        }

        $this->facts->publishAfterCommit(new ReceiptDeliveriesScheduled($deliveryIds));
    }

    /**
     * One pass over the deliveries due now, oldest due first.
     */
    public function deliverDue(CarbonImmutable $at): void
    {
        $deliveryIds = ReceiptDelivery::query()
            ->dueAt($at)
            ->orderBy('next_attempt_at')
            ->orderBy('id')
            ->limit(self::PASS_LIMIT)
            ->pluck('id')
            ->all();

        array_map(strval(...), $deliveryIds)
            |> array_values(...)
            |> (fn ($x) => $this->deliver($x, $at));
    }

    /**
     * Tries each delivery that is still due, each in its own transaction with its own event unit, since no command
     * runs around a pass; one another worker holds is left to it.
     *
     * @param  list<string>  $deliveryIds
     */
    public function deliver(array $deliveryIds, CarbonImmutable $at): void
    {
        foreach ($deliveryIds as $deliveryId) {
            $this->database->beginTransaction();

            $this->unitOfWork->run(
                $this->database,
                self::UNIT_OWNER,
                fn () => $this->deliverOne($deliveryId, $at),
                fn () => $this->database->commit(),
                fn () => $this->database->rollBack(),
            );
        }
    }

    private function deliverOne(string $deliveryId, CarbonImmutable $at): void
    {
        $delivery = ReceiptDelivery::query()
            ->whereKey($deliveryId)
            ->dueAt($at)
            ->lock('for update skip locked')
            ->with('receipt.interval')
            ->first();

        if ($delivery === null) {
            return;
        }

        $receipt = $delivery->receipt;
        $interval = $receipt->interval;

        if ($receipt->isPresented()) {
            $delivery->accept();

            return;
        }

        if (! $interval->isActive()) {
            $delivery->cancel();

            return;
        }

        $message = Message::query()->acrossInboxes()->findOrFail($receipt->message_id);
        $origin = AttentionOrigin::message($message->id, $message->origin_receipt_id);

        try {
            $outcome = $this->database->transaction(fn () => $this->attention->request($interval->actor, $origin));
        } catch (RuntimeException $refused) {
            $this->recordFailure($delivery, $refused->getMessage(), $at);

            return;
        }

        $earlier = MessageAttention::ofOriginFor($origin, $interval->actor);
        $earlier->forAll(fn (MessageAttention $asked) => $asked->recordAgain($outcome));

        if ($earlier->isEmpty()) {
            MessageAttention::create($origin, $interval->inbox_id, $interval->actor, $outcome);
        }

        if ($outcome->requestId === null) {
            $delivery->await();

            return;
        }

        // The wake was taken; only the driver's confirmed presentation settles the delivery.
        $delivery->awaitPresentation($at->addSeconds(PresentationBatches::LEASE_SECONDS));
    }

    private function recordFailure(ReceiptDelivery $delivery, string $failure, CarbonImmutable $at): void
    {
        $reason = mb_strimwidth($failure, 0, self::FAILURE_LENGTH, '…');

        if ($delivery->isLastTry(self::ALLOWED_TRIES)) {
            $delivery->exhaust($reason);

            return;
        }

        $wait = min(self::FIRST_BACKOFF_SECONDS * (2 ** $delivery->attempts), self::LONGEST_BACKOFF_SECONDS);
        $delivery->fail($reason, $at->addSeconds($wait));
    }
}
