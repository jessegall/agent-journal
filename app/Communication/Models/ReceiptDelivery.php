<?php

declare(strict_types=1);

namespace App\Communication\Models;

use App\Communication\Data\WakeStatus;
use App\Communication\Enums\ReceiptDeliveryState;
use App\Communication\Events\ReceiptDeliveryChanged;
use App\Communication\Exceptions\ChatStateConflict;
use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * The work of waking one recipient about one receipt: tried until the recipient's runtime accepts it or it is found
 * to run nowhere, retried with a later attempt time after each failure, and given up once the tries run out.
 *
 * @property string $id
 * @property string $receipt_id
 * @property string $notification_key
 * @property ReceiptDeliveryState $state
 * @property int $attempts
 * @property CarbonImmutable|null $next_attempt_at
 * @property CarbonImmutable|null $lease_expires_at
 * @property string|null $last_failure
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Table('receipt_deliveries')]
#[Fillable(['receipt_id', 'notification_key', 'state', 'attempts', 'next_attempt_at'])]
final class ReceiptDelivery extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use RaisesEvents;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'state' => ReceiptDeliveryState::class,
            'attempts' => 'integer',
            'next_attempt_at' => 'immutable_datetime',
            'lease_expires_at' => 'immutable_datetime',
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }

    /**
     * A new delivery for the receipt, due at once, keyed so the recipient's runtime takes it only once.
     */
    public static function pending(MessageReceipt $receipt): self
    {
        $delivery = new self([
            'receipt_id' => $receipt->id,
            'notification_key' => $receipt->id,
            'state' => ReceiptDeliveryState::Pending,
            'attempts' => 0,
            'next_attempt_at' => CarbonImmutable::now(),
        ]);

        $delivery->assertSaved($delivery->save());

        return $delivery;
    }

    // ----------[ Mutations ]----------

    /**
     * Holds the delivery for one attempt until the lease runs out, so no second worker tries it meanwhile.
     *
     * @throws ChatStateConflict
     */
    public function lease(CarbonImmutable $until): void
    {
        $this->assertPending();
        $this->lease_expires_at = $until;
        $this->assertSaved($this->save());
    }

    /**
     * @throws ChatStateConflict
     */
    public function accept(): void
    {
        $this->assertPending();
        $this->state = ReceiptDeliveryState::Accepted;
        $this->attempts++;
        $this->lease_expires_at = null;
        $this->next_attempt_at = null;
        $this->recordChange();
    }

    /**
     * The recipient runs in no runtime now: the delivery waits for it to start, without spending a try, and its
     * startup finds the receipt among its pending work.
     *
     * @throws ChatStateConflict
     */
    public function await(): void
    {
        $this->assertPending();
        $this->state = ReceiptDeliveryState::Waiting;
        $this->next_attempt_at = null;
        $this->lease_expires_at = null;
        $this->recordChange();
    }

    /**
     * Counts a failed try and sets when the next one is due.
     *
     * @throws ChatStateConflict
     */
    public function fail(string $reason, CarbonImmutable $nextAt): void
    {
        $this->assertPending();
        $this->attempts++;
        $this->last_failure = $reason;
        $this->next_attempt_at = $nextAt;
        $this->lease_expires_at = null;
        $this->recordChange();
    }

    /**
     * Counts the last failed try and gives the delivery up.
     *
     * @throws ChatStateConflict
     */
    public function exhaust(string $reason): void
    {
        $this->assertPending();
        $this->state = ReceiptDeliveryState::Exhausted;
        $this->attempts++;
        $this->last_failure = $reason;
        $this->next_attempt_at = null;
        $this->lease_expires_at = null;
        $this->recordChange();
    }

    /**
     * The delivery is no longer wanted, such as when its recipient left or already saw the message.
     *
     * @throws ChatStateConflict
     */
    public function cancel(): void
    {
        $this->assertPending();
        $this->state = ReceiptDeliveryState::Cancelled;
        $this->next_attempt_at = null;
        $this->lease_expires_at = null;
        $this->recordChange();
    }

    // ----------[ Answers ]----------

    /**
     * Where the wake of this delivery's recipient stands, for a delivery no runtime has taken yet.
     */
    public function wakeStatus(): WakeStatus
    {
        $actor = $this->receipt->interval->actor;

        return new WakeStatus($actor->type->value, $actor->id, null, $this->state->wakeState());
    }

    /**
     * Whether this failure is the last one allowed.
     */
    public function isLastTry(int $allowedTries): bool
    {
        return $this->attempts + 1 >= $allowedTries;
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<MessageReceipt, $this>
     */
    public function receipt(): BelongsTo
    {
        return $this->belongsTo(MessageReceipt::class, 'receipt_id');
    }

    // ----------[ Internals ]----------

    private function recordChange(): void
    {
        $this->assertSaved($this->save());
        $this->raise(new ReceiptDeliveryChanged($this->id, $this->receipt_id, $this->state));
    }

    /**
     * @throws ChatStateConflict
     */
    private function assertPending(): void
    {
        if (! $this->state->isPending()) {
            throw ChatStateConflict::deliverySettled($this->id);
        }
    }

    // ----------[ Scopes ]----------

    /**
     * Pending deliveries whose next try is due and that no worker holds a live lease on.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function dueAt(Builder $query, CarbonImmutable $at): void
    {
        $query->where('state', ReceiptDeliveryState::Pending)
            ->where('next_attempt_at', '<=', $at)
            ->where(fn (Builder $free) => $free->whereNull('lease_expires_at')->orWhere('lease_expires_at', '<', $at));
    }

    /**
     * The deliveries of a message's receipts that no runtime took and that wait for no startup: pending, exhausted or
     * cancelled ones.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unwokenFor(Builder $query, string $messageId): void
    {
        $query->whereIn('receipt_id', MessageReceipt::query()->where('message_id', $messageId)->select('id'))
            ->whereIn('state', [
                ReceiptDeliveryState::Pending,
                ReceiptDeliveryState::Exhausted,
                ReceiptDeliveryState::Cancelled,
            ]);
    }

    /**
     * The pending deliveries of one interval's receipts.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function pendingForInterval(Builder $query, string $intervalId): void
    {
        $query->where('state', ReceiptDeliveryState::Pending)
            ->whereIn('receipt_id', MessageReceipt::query()->ofInterval($intervalId)->select('id'));
    }
}
