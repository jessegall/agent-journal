<?php

declare(strict_types=1);

namespace App\Models\Hosts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Connections\HostOrderAnswered;
use App\Events\Connections\HostOrderClaimed;
use App\Events\Connections\HostOrderMade;
use App\Events\Connections\HostOrderOfferedAgain;
use App\Events\Connections\HostOrderRefused;
use App\Hosts\Data\HostAnswerData;
use App\Hosts\Enums\HostOrderStatus;
use App\Hosts\Enums\HostOrderType;
use App\Hosts\Enums\HostRefusal;
use App\Hosts\Exceptions\HostOrderStateRefused;
use App\Hosts\HostOrderPayload;
use App\Hosts\Values\HostOrderBody;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $host_id
 * @property string|null $host_process_id
 * @property string|null $driver_request_id
 * @property string|null $step
 * @property string $idempotency_key
 * @property int $sequence
 * @property HostOrderType $type
 * @property string $payload
 * @property string $kept_payload
 * @property CarbonImmutable $expires_at
 * @property HostOrderStatus $status
 * @property HostRefusal|null $refusal
 * @property HostAnswerData|null $answer
 * @property CarbonImmutable|null $claimed_at
 * @property CarbonImmutable|null $answered_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class HostOrder extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    /**
     * How long a claimed order waits for its answer before it is handed out again; the host answers one it carried out
     * from its record and refuses one it was stopped in, so none is carried out twice.
     */
    public const int CLAIM_SECONDS = 10;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => HostOrderType::class,
            'status' => HostOrderStatus::class,
            'refusal' => HostRefusal::class,
            'sequence' => 'integer',
            'payload' => 'encrypted',
            'kept_payload' => 'encrypted',
            'answer' => HostAnswerData::class,
            'expires_at' => 'immutable_datetime',
            'claimed_at' => 'immutable_datetime',
            'answered_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * An order to the host, numbered after the process's last one, or the host's when it is about no process; the
     * caller holds that row's lock.
     */
    public static function create(
        Host $host,
        HostProcess|null $process,
        HostOrderBody $body,
        CarbonImmutable $expires,
        int $sequence,
    ): self {
        $order = new self();
        $order->host_id = $host->id;
        $order->host_process_id = $process?->id;
        $order->driver_request_id = $body->driverRequestId;
        $order->step = $body->step;
        $order->idempotency_key = $body->idempotencyKey;
        $order->sequence = $sequence;
        $order->type = $body->type;
        $order->payload = HostOrderPayload::encode($body->payload);
        $order->kept_payload = HostOrderPayload::encode($body->keptPayload());
        $order->expires_at = $expires;
        $order->status = HostOrderStatus::Pending;
        $order->saveAndAssert();
        $order->raise(new HostOrderMade($order->id, $process?->id, $host->id));

        return $order;
    }

    // ----------[ Mutations ]----------

    /**
     * The host claimed the order to carry it out, at the time given.
     */
    public function claim(CarbonImmutable $at): void
    {
        $this->status = HostOrderStatus::Claimed;
        $this->claimed_at = $at;
        $this->saveAndAssert();
        $this->raise(new HostOrderClaimed($this->id, $this->host_process_id));
    }

    /**
     * Offers the claimed order to the host again, as a claim of its earlier process never reached it or its answer
     * never reached the journal.
     */
    public function offerAgain(): void
    {
        $this->status = HostOrderStatus::Pending;
        $this->claimed_at = null;
        $this->saveAndAssert();
        $this->raise(new HostOrderOfferedAgain($this->id, $this->host_process_id));
    }

    /**
     * The host carried the order out, and the order keeps its answer.
     *
     * @throws HostOrderStateRefused
     */
    public function answer(HostAnswerData $answer, CarbonImmutable $at): void
    {
        if ($answer->isRefused()) {
            $this->refuse($answer->refusalReason(), $answer->facts, $at);

            return;
        }

        $this->assertOpen();
        $this->forgetCarriedSecrets();
        $this->status = HostOrderStatus::Done;
        $this->answer = $answer;
        $this->answered_at = $at;
        $this->saveAndAssert();
        $this->raise(new HostOrderAnswered($this->id, $this->host_process_id, $this->type));
    }

    /**
     * The host refused the order, with the reason and the facts it gave.
     *
     * @param  array<string, mixed>  $facts
     *
     * @throws HostOrderStateRefused
     */
    public function refuse(HostRefusal $refusal, array $facts, CarbonImmutable $at): void
    {
        $this->assertOpen();
        $this->forgetCarriedSecrets();
        $this->status = HostOrderStatus::Refused;
        $this->refusal = $refusal;
        $this->answer = new HostAnswerData(HostOrderStatus::Refused, $refusal, $facts);
        $this->answered_at = $at;
        $this->saveAndAssert();
        $this->raise(new HostOrderRefused($this->id, $this->host_process_id, $this->type, $refusal));
    }

    /**
     * The order was not carried out in time and expires.
     *
     * @throws HostOrderStateRefused
     */
    public function expire(CarbonImmutable $at): void
    {
        $this->refuse(HostRefusal::Expired, [], $at);
    }

    /**
     * An input order's bytes and an open order's environment, which holds the start's credentials, are needed only
     * until the host answers it: then only what the payload keeps stays, so neither is kept longer than it travels.
     */
    private function forgetCarriedSecrets(): void
    {
        $this->payload = $this->kept_payload;
    }

    // ----------[ Predicates ]----------

    public function isOpen(): bool
    {
        return $this->status === HostOrderStatus::Pending || $this->status === HostOrderStatus::Claimed;
    }

    // ----------[ Asserts ]----------

    /**
     * @throws HostOrderStateRefused
     */
    private function assertOpen(): void
    {
        if (! $this->isOpen()) {
            throw HostOrderStateRefused::alreadyEnded($this->id, $this->status);
        }
    }

    // ----------[ Queries ]----------

    /**
     * The order, locked until the transaction ends, so one answer is stored at a time.
     */
    public static function findLocked(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOrFail();
    }

    /**
     * The open orders whose expiry passed, locked so a claim beside this sweep skips them.
     *
     * @return list<self>
     */
    public static function findExpiredAt(CarbonImmutable $now, int $limit): array
    {
        $orders = self::query()
            ->whereIn('status', [HostOrderStatus::Pending, HostOrderStatus::Claimed])
            ->where('expires_at', '<=', $now)
            ->lock('for update skip locked')
            ->readExactly($limit)
            ->get();

        return array_values($orders->all());
    }

    /**
     * The open orders of a process, locked.
     *
     * @return list<self>
     */
    public static function findOpenOf(string $processId): array
    {
        $orders = self::query()
            ->where('host_process_id', $processId)
            ->whereIn('status', [HostOrderStatus::Pending, HostOrderStatus::Claimed])
            ->lockForUpdate()
            ->get();

        return array_values($orders->all());
    }

    /**
     * The orders made for the process, by their number.
     *
     * @return list<self>
     */
    public static function findForProcess(string $processId): array
    {
        return array_values(self::query()->where('host_process_id', $processId)->orderBy('sequence')->get()->all());
    }

    /**
     * The orders made for the host itself, for no process of it, oldest first.
     *
     * @return list<self>
     */
    public static function findForHostItself(string $hostId): array
    {
        return array_values(self::query()->where('host_id', $hostId)->whereNull('host_process_id')->orderBy('sequence')
            ->limit(64)->get()->all());
    }

    /**
     * The orders a host claimed and has not answered, locked, as its start reads them.
     *
     * @return list<self>
     */
    public static function findClaimedOf(Host $host): array
    {
        $orders = self::query()->forHost($host)->where('status', HostOrderStatus::Claimed)->lockForUpdate()->get();

        return array_values($orders->all());
    }

    /**
     * The order made under the key before, so a repeated step makes no second one.
     */
    public static function findWithKey(string $idempotencyKey): self|null
    {
        return self::query()->where('idempotency_key', $idempotencyKey)->first();
    }

    /**
     * The seconds until the first order the host claimed and has not answered may be handed out again, at least one;
     * null when it holds none, so a claim that waits wakes in time to hand it out.
     */
    public static function secondsUntilRetakeable(Host $host, CarbonImmutable $now): int|null
    {
        $oldest = self::query()
            ->forHost($host)
            ->where('status', HostOrderStatus::Claimed)
            ->where('expires_at', '>', $now)
            ->min('claimed_at');

        if ($oldest === null) {
            return null;
        }

        $retakeable = CarbonImmutable::parse((string) $oldest)->addSeconds(self::CLAIM_SECONDS);

        return max(1, (int) ceil($now->diffInSeconds($retakeable, false)));
    }

    /**
     * The orders the host may take now, by their number: those waiting and in time, and those it claimed that went
     * unanswered too long, locked so a claim beside this one skips them.
     *
     * @return list<self>
     */
    public static function claimable(Host $host, CarbonImmutable $now, int $limit): array
    {
        $orders = self::query()
            ->forHost($host)
            ->takeableAt($now)
            ->orderBy('sequence')
            ->lock('for update skip locked')
            ->readExactly($limit)
            ->get();

        return array_values($orders->all());
    }

    /**
     * The orders of a driver request that were made and not refused, waiting, handed out or carried out, by their
     * number: where a new worker takes the request up without ordering a step twice.
     *
     * @return list<self>
     */
    public static function orderedFor(DriverRequest $request): array
    {
        $orders = self::query()
            ->ofDriverRequest($request)
            ->whereIn('status', [HostOrderStatus::Pending, HostOrderStatus::Claimed, HostOrderStatus::Done])
            ->orderBy('sequence')
            ->get();

        return array_values($orders->all());
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forHost(Builder $query, Host $host): void
    {
        $query->where('host_id', $host->id);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofDriverRequest(Builder $query, DriverRequest $request): void
    {
        $query->where('driver_request_id', $request->id);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function takeableAt(Builder $query, CarbonImmutable $now): void
    {
        $query->where('expires_at', '>', $now)->where(
            fn (Builder $takeable) => $takeable->where('status', HostOrderStatus::Pending)->orWhere(
                fn (Builder $unanswered) => $unanswered->where('status', HostOrderStatus::Claimed)
                    ->where('claimed_at', '<', $now->subSeconds(self::CLAIM_SECONDS)),
            ),
        );
    }

    /**
     * The orders the host answered done before the moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function answeredDoneBefore(Builder $query, CarbonImmutable $before): void
    {
        $query->where('status', HostOrderStatus::Done)->where('answered_at', '<', $before);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function answeredBefore(Builder $query, CarbonImmutable $before): void
    {
        $query->whereIn('status', [HostOrderStatus::Done, HostOrderStatus::Refused])
            ->where('answered_at', '<', $before);
    }
}
