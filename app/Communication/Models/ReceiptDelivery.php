<?php

declare(strict_types=1);

namespace App\Communication\Models;

use App\Communication\Enums\ReceiptDeliveryState;
use App\Communication\Exceptions\ChatStateConflict;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * The work of waking one recipient about one receipt: tried until the recipient's runtime accepts it, retried with a
 * later attempt time after each failure, and given up once the tries run out.
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
final class ReceiptDelivery extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;

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
            'notification_key' => "chat-receipt:{$receipt->id}",
            'state' => ReceiptDeliveryState::Pending,
            'attempts' => 0,
            'next_attempt_at' => CarbonImmutable::now(),
        ]);

        $delivery->save();

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
        $this->save();
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
        $this->save();
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
        $this->save();
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
        $this->save();
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
        $this->save();
    }

    // ----------[ Internals ]----------

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
}
