<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsRowSets;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\EventSource;
use App\Contracts\ReadableModel;
use App\Events\ChatReceiptPresented;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * That one chat message reached one membership interval, and when it was first shown to that member. The sender's
 * own receipt is shown from the start.
 *
 * @property string $id
 * @property string $message_id
 * @property string $interval_id
 * @property CarbonImmutable|null $presented_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 */
#[Table('message_receipts')]
#[Fillable(['message_id', 'interval_id', 'presented_at'])]
final class MessageReceipt extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsRowSets;
    use Linkable;
    use RaisesEvents;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'presented_at' => 'immutable_datetime',
            'created_at' => 'immutable_datetime',
            'updated_at' => 'immutable_datetime',
        ];
    }

    /**
     * One receipt for each interval the message reached, in one insert; the sender's interval is presented at once.
     * Answers the receipts written, each holding its interval.
     *
     * @param  list<InboxInterval>  $intervals
     * @return list<self>
     */
    public static function forAudience(Message $message, array $intervals, string $senderIntervalId): array
    {
        $now = CarbonImmutable::now();

        $receipts = array_map(function (InboxInterval $interval) use ($message, $now, $senderIntervalId): self {
            $receipt = new self([
                'message_id' => $message->id,
                'interval_id' => $interval->id,
                'presented_at' => $interval->id === $senderIntervalId ? $now : null,
            ]);

            $receipt->setRelation('interval', $interval);

            return $receipt;
        }, $intervals);

        self::createAll($receipts);

        return $receipts;
    }

    // ----------[ Mutations ]----------

    /**
     * Marks the receipt shown, once: a later presentation keeps the first time, so two readers racing change it
     * only once. Answers whether this call was the one that changed it.
     */
    public function present(CarbonImmutable $at): bool
    {
        $this->presented_at = self::query()->whereKey($this->id)->lockForUpdate()->sole()->presented_at;

        if ($this->presented_at !== null) {
            return false;
        }

        $this->presented_at = $at;
        $this->assertSaved($this->save());
        $this->raise(new ChatReceiptPresented($this->id, $this->message_id, $this->interval_id));

        return true;
    }

    // ----------[ Answers ]----------

    public function isPresented(): bool
    {
        return $this->presented_at !== null;
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<InboxInterval, $this>
     */
    public function interval(): BelongsTo
    {
        return $this->belongsTo(InboxInterval::class, 'interval_id');
    }

    /**
     * @return BelongsTo<Message, $this>
     */
    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'message_id');
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofInterval(Builder $query, string $intervalId): void
    {
        $query->where('interval_id', $intervalId);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function notPresented(Builder $query): void
    {
        $query->whereNull('presented_at');
    }
}
