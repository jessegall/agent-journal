<?php

declare(strict_types=1);

namespace App\Models\Hosts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Data\Hosts\HostAnswerData;
use App\Enums\Hosts\HostOrderStatus;
use App\Enums\Hosts\HostOrderType;
use App\Enums\Hosts\HostRefusal;
use App\Events\Connections\HostOrderAnswered;
use App\Events\Connections\HostOrderMade;
use App\Events\Connections\HostOrderRefused;
use App\Exceptions\HostOrderStateRefused;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Models\Support\JournalModel;
use App\Values\HostOrderBody;
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
 * @property array<string, mixed> $payload
 * @property CarbonImmutable $expires_at
 * @property HostOrderStatus $status
 * @property HostRefusal|null $refusal
 * @property array<string, mixed>|null $answer
 * @property CarbonImmutable|null $claimed_at
 * @property CarbonImmutable|null $answered_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 *
 * @column payload array<string, mixed>
 * @column answer array<string, mixed>
 */
final class HostOrder extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    /**
     * How long a claimed order that writes nothing into a process waits for its answer before it is handed out again.
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
            'payload' => 'encrypted:array',
            'answer' => 'array',
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
    ): self {
        $order = new self();
        $order->host_id = $host->id;
        $order->host_process_id = $process?->id;
        $order->driver_request_id = $body->driverRequestId;
        $order->step = $body->step;
        $order->idempotency_key = $body->idempotencyKey;
        $order->sequence = $process === null ? $host->takeOrderNumber() : $process->takeOrderNumber();
        $order->type = $body->type;
        $order->payload = $body->payload;
        $order->expires_at = $expires;
        $order->status = HostOrderStatus::Pending;
        $order->assertSaved($order->save());
        $order->raise(new HostOrderMade($order->id, $host->id));

        return $order;
    }

    // ----------[ Mutations ]----------

    public function claim(CarbonImmutable $at): void
    {
        $this->status = HostOrderStatus::Claimed;
        $this->claimed_at = $at;
        $this->assertSaved($this->save());
    }

    /**
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
        $this->answer = $answer->facts;
        $this->answered_at = $at;
        $this->assertSaved($this->save());
        $this->raise(new HostOrderAnswered($this->id, $this->host_process_id, $this->type));
    }

    /**
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
        $this->answer = $facts;
        $this->answered_at = $at;
        $this->assertSaved($this->save());
        $this->raise(new HostOrderRefused($this->id, $this->host_process_id, $this->type, $refusal));
    }

    /**
     * @throws HostOrderStateRefused
     */
    public function expire(CarbonImmutable $at): void
    {
        $this->refuse(HostRefusal::Expired, [], $at);
    }

    /**
     * An input order's bytes and an open order's environment, which holds the start's credentials, are needed only
     * until the host answers it: then they are erased, so neither is kept longer than it travels.
     */
    private function forgetCarriedSecrets(): void
    {
        if ($this->type->isInput()) {
            $this->payload = [];
        }

        if ($this->type->isOpening()) {
            $this->payload = [...$this->payload, 'environment' => []];
        }
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
     * Deletes the orders answered before the moment and answers how many: an answered order is kept only as long as a
     * worker may still read it.
     */
    public static function pruneAnsweredBefore(CarbonImmutable $before): int
    {
        return self::query()
            ->whereIn('status', [HostOrderStatus::Done, HostOrderStatus::Refused])
            ->where('answered_at', '<', $before)
            ->delete();
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
     * The input orders the host claimed and did not answer, locked: after a restart none of them may land.
     *
     * @return list<self>
     */
    public static function findClaimedInputsOf(Host $host): array
    {
        $orders = self::query()
            ->forHost($host)
            ->where('status', HostOrderStatus::Claimed)
            ->whereIn('type', HostOrderType::inputs())
            ->lockForUpdate()
            ->get();

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
     * The orders the host may take now, by their number: those waiting and in time, and those it claimed that write
     * nothing into a process and went unanswered too long, locked so a claim beside this one skips them.
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
        $inputTypes = HostOrderType::inputs();

        $query->where('expires_at', '>', $now)->where(
            fn (Builder $takeable) => $takeable->where('status', HostOrderStatus::Pending)->orWhere(
                fn (Builder $unanswered) => $unanswered->where('status', HostOrderStatus::Claimed)
                    ->whereNotIn('type', $inputTypes)
                    ->where('claimed_at', '<', $now->subSeconds(self::CLAIM_SECONDS)),
            ),
        );
    }
}
