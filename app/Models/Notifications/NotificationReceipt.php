<?php

declare(strict_types=1);

namespace App\Models\Notifications;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Messages\NotificationReceiptHidden;
use App\Events\Messages\NotificationReceiptRead;
use App\Events\Messages\NotificationReceiptRevealed;
use App\Models\Support\JournalModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use PhpOption\Option;

/**
 * @property string $id
 * @property string $occurrence_id
 * @property string $scope_id
 * @property int $sequence
 * @property CarbonImmutable|null $read_at
 * @property CarbonImmutable|null $hidden_at
 * @property CarbonImmutable|null $created_at
 * @property-read NotificationOccurrence $occurrence
 *
 * @mixin \Eloquent
 */
#[Table('notification_receipts')]
final class NotificationReceipt extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    public const ?string UPDATED_AT = null;

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'sequence' => 'integer',
            'read_at' => 'immutable_datetime',
            'hidden_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The scope's receipt of the occurrence at the scope's next sequence, inserted unless the scope already holds
     * one; isNew() tells a replay apart.
     */
    public static function create(NotificationOccurrence $occurrence, NotificationScope $scope): self
    {
        $receipt = new self();
        $receipt->occurrence_id = $occurrence->id;
        $receipt->scope_id = $scope->id;
        $receipt->sequence = $scope->next_sequence;

        $receipt->id = $receipt->newUniqueId();
        $receipt->insertIfAbsent();

        return $receipt;
    }

    // ----------[ Mutations ]----------

    /**
     * Marks the receipt read once; a second call changes nothing and keeps the first read time.
     */
    public function markRead(CarbonImmutable $at): bool
    {
        if ($this->read_at !== null) {
            return false;
        }

        $this->read_at = $at;
        $this->saveAndAssert();
        $this->raise(new NotificationReceiptRead($this->id));

        return true;
    }

    /**
     * Hides the receipt from its recipient's list and count; hiding it again changes nothing.
     */
    public function hide(CarbonImmutable $at): bool
    {
        if ($this->hidden_at !== null) {
            return false;
        }

        $this->hidden_at = $at;
        $this->saveAndAssert();
        $this->raise(new NotificationReceiptHidden($this->id));

        return true;
    }

    /**
     * Shows a hidden receipt again; a visible one stays as it is.
     */
    public function reveal(): bool
    {
        if ($this->hidden_at === null) {
            return false;
        }

        $this->hidden_at = null;
        $this->saveAndAssert();
        $this->raise(new NotificationReceiptRevealed($this->id));

        return true;
    }

    // ----------[ Predicates ]----------

    public function isNew(): bool
    {
        return $this->wasRecentlyCreated;
    }

    public function isHidden(): bool
    {
        return $this->hidden_at !== null;
    }

    /**
     * Whether the receipt counts toward its scope's unread count: unread and not hidden.
     */
    public function isCounted(): bool
    {
        return $this->read_at === null && $this->hidden_at === null;
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<NotificationOccurrence, $this>
     */
    public function occurrence(): BelongsTo
    {
        return $this->belongsTo(NotificationOccurrence::class, 'occurrence_id');
    }

    // ----------[ Queries ]----------

    /**
     * The scope's visible receipts newest first by sequence, older than the given sequence when one is given, with
     * their occurrences; at most the given number.
     *
     * @return list<self>
     */
    public static function findVisibleInScope(string $scopeId, int|null $beforeSequence, int $limit): array
    {
        return array_values(self::query()
            ->inScope($scopeId)
            ->visible()
            ->beforeSequence($beforeSequence)
            ->newestSequenceFirst()
            ->with('occurrence')
            ->readUpTo($limit)
            ->get()
            ->all());
    }

    /**
     * The scope's visible receipts of one target type whose target id the query lists, at most the given number.
     *
     * @param  Builder<*>  $ids
     * @return list<self>
     */
    public static function findVisibleWithTargetIn(
        string $scopeId,
        string $targetKey,
        Builder $ids,
        int $limit,
    ): array {
        return array_values(self::query()
            ->inScope($scopeId)
            ->visible()
            ->ofOccurrences(NotificationOccurrence::query()->targeting($targetKey, $ids))
            ->readUpTo($limit)
            ->get()
            ->all());
    }

    /**
     * The scope's unread visible receipts after one sequence up to the watermark, oldest first, at most the limit:
     * a seek on the scope's unread index that never reads read or hidden history.
     *
     * @return list<self>
     */
    public static function findUnreadThrough(string $scopeId, int $afterSequence, int $through, int $limit): array
    {
        return array_values(self::query()
            ->inScope($scopeId)
            ->unread()
            ->visible()
            ->inSequenceRange($afterSequence, $through)
            ->inSequenceOrder()
            ->readUpTo($limit)
            ->get()
            ->all());
    }

    /**
     * The receipts of these ids with their occurrences, by id.
     *
     * @param  list<string>  $ids
     * @return array<string, self>
     */
    public static function findWithOccurrences(array $ids): array
    {
        if ($ids === []) {
            return [];
        }

        return self::query()->whereKey($ids)->with('occurrence')->readExactly(count($ids))->get()->keyBy('id')->all();
    }

    /**
     * The receipt of this id, only when it belongs to the scope.
     *
     * @return Option<self>
     */
    public static function findInScope(string $scopeId, string $id): Option
    {
        $receipt = self::query()->inScope($scopeId)->whereKey($id)->first();

        return Option::fromValue($receipt);
    }

    /**
     * The scope's receipts that lead to this target, at most the given number.
     *
     * @return list<self>
     */
    public static function findAllForTarget(string $scopeId, string $targetKey, string $targetId, int $limit): array
    {
        return array_values(self::query()
            ->inScope($scopeId)
            ->ofOccurrences(NotificationOccurrence::query()->aboutTarget($targetKey, $targetId))
            ->readUpTo($limit)
            ->get()
            ->all());
    }

    /**
     * The scope's receipt of the occurrence that leads to this target, when the scope holds one.
     *
     * @return Option<self>
     */
    public static function findForTarget(string $scopeId, string $targetKey, string $targetId): Option
    {
        $receipt = self::query()
            ->inScope($scopeId)
            ->ofOccurrences(NotificationOccurrence::query()->aboutTarget($targetKey, $targetId))
            ->first();

        return Option::fromValue($receipt);
    }

    // ----------[ Scopes ]----------

    /**
     * The scope's receipts.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inScope(Builder $query, string $scopeId): void
    {
        $query->where('scope_id', $scopeId);
    }

    /**
     * The receipts not hidden.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function visible(Builder $query): void
    {
        $query->whereNull('hidden_at');
    }

    /**
     * The receipts not read yet.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unread(Builder $query): void
    {
        $query->whereNull('read_at');
    }

    /**
     * The receipts before that sequence number; all of them with none.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function beforeSequence(Builder $query, int|null $sequence): void
    {
        $query->when($sequence !== null, fn (Builder $older) => $older->where('sequence', '<', $sequence));
    }

    /**
     * The receipts after the first sequence number, up to and with the second.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inSequenceRange(Builder $query, int $after, int $through): void
    {
        $query->where('sequence', '>', $after)->where('sequence', '<=', $through);
    }

    /**
     * The receipts newest sequence number first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestSequenceFirst(Builder $query): void
    {
        $query->orderByDesc('sequence');
    }

    /**
     * The receipts in the order of their sequence number.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inSequenceOrder(Builder $query): void
    {
        $query->orderBy('sequence');
    }

    /**
     * The receipts of the occurrences the query selects.
     *
     * @param  Builder<self>  $query
     * @param  Builder<NotificationOccurrence>  $occurrences
     */
    #[Scope]
    protected function ofOccurrences(Builder $query, Builder $occurrences): void
    {
        $query->whereIn('occurrence_id', $occurrences->select('id'));
    }
}
