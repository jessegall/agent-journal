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
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use PhpOption\Option;

/**
 * One recipient's copy of one notification occurrence: its place in the scope's sequence, and when the recipient
 * read it or it was hidden. Only an unread receipt that is not hidden counts. Change it only through
 * NotificationReceipts, which holds the scope's lock so the count follows.
 *
 * @property string $id
 * @property string $occurrence_id
 * @property string $scope_id
 * @property int $sequence
 * @property CarbonImmutable|null $read_at
 * @property CarbonImmutable|null $hidden_at
 * @property CarbonImmutable|null $created_at
 * @property-read NotificationOccurrence $occurrence
 */
#[Table('notification_receipts')]
#[Fillable(['occurrence_id', 'scope_id', 'sequence'])]
final class NotificationReceipt extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
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
        $receipt = new self([
            'occurrence_id' => $occurrence->id,
            'scope_id' => $scope->id,
            'sequence' => $scope->next_sequence,
        ]);

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
        $this->assertSaved($this->save());
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
        $this->assertSaved($this->save());
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
        $this->assertSaved($this->save());
        $this->raise(new NotificationReceiptRevealed($this->id));

        return true;
    }

    // ----------[ Getters ]----------

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
    public static function visibleInScope(string $scopeId, int|null $beforeSequence, int $limit): array
    {
        return array_values(self::query()
            ->where('scope_id', $scopeId)
            ->whereNull('hidden_at')
            ->when($beforeSequence !== null, fn (Builder $older) => $older->where('sequence', '<', $beforeSequence))
            ->orderByDesc('sequence')
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
    public static function visibleWithTargetIn(
        string $scopeId,
        string $targetKey,
        Builder $ids,
        int $limit,
    ): array {
        return array_values(self::query()
            ->where('scope_id', $scopeId)
            ->whereNull('hidden_at')
            ->whereIn(
                'occurrence_id',
                NotificationOccurrence::query()->targeting($targetKey, $ids)->select('id'),
            )
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
    public static function unreadThrough(string $scopeId, int $afterSequence, int $through, int $limit): array
    {
        return array_values(self::query()
            ->where('scope_id', $scopeId)
            ->whereNull('read_at')
            ->whereNull('hidden_at')
            ->where('sequence', '>', $afterSequence)
            ->where('sequence', '<=', $through)
            ->orderBy('sequence')
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
    public static function withOccurrences(array $ids): array
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
        return Option::fromValue(self::query()->where('scope_id', $scopeId)->whereKey($id)->first());
    }

    /**
     * The scope's receipts that lead to this target, at most the given number.
     *
     * @return list<self>
     */
    public static function allForTarget(string $scopeId, string $targetKey, string $targetId, int $limit): array
    {
        return array_values(self::query()
            ->where('scope_id', $scopeId)
            ->whereIn(
                'occurrence_id',
                NotificationOccurrence::query()->where('target_key', $targetKey)->where('target_id', $targetId)
                    ->select('id'),
            )
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
        return Option::fromValue(self::query()
            ->where('scope_id', $scopeId)
            ->whereIn(
                'occurrence_id',
                NotificationOccurrence::query()->where('target_key', $targetKey)->where('target_id', $targetId)
                    ->select('id'),
            )
            ->first());
    }

    /**
     * The scope's receipt of the occurrence with this key, when the scope holds one.
     *
     * @return Option<self>
     */
    public static function findForOccurrence(string $scopeId, string $occurrenceKey): Option
    {
        return Option::fromValue(self::query()
            ->where('scope_id', $scopeId)
            ->whereIn('occurrence_id', NotificationOccurrence::query()->keyed($occurrenceKey)->select('id'))
            ->first());
    }
}
