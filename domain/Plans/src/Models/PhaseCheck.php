<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use App\Values\PublishedResult;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $phase_id
 * @property string $operation
 * @property string $receipt_id
 * @property string $outcome
 * @property string $actor_type
 * @property string $actor_id
 * @property CarbonImmutable $recorded_at
 *
 * @mixin \Eloquent
 */
final class PhaseCheck extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use InsertsAbsentRows;
    use Linkable;

    public const string CREATED_AT = 'recorded_at';

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['recorded_at' => 'datetime'];
    }

    // ----------[ Constructors ]----------

    /**
     * The phase relies on this receipt's result; recording the same receipt again changes nothing.
     */
    public static function create(Phase $phase, PublishedResult $receipt, ActorReference $recorder): self
    {
        $check = new self();
        $check->phase_id = $phase->id;
        $check->receipt_id = $receipt->receiptId;
        $check->operation = $receipt->operation;
        $check->outcome = $receipt->outcome->value;
        $check->actor_type = $recorder->type;
        $check->actor_id = $recorder->id;

        $check->setAttribute($check->getKeyName(), $check->newUniqueId());
        $check->insertIfAbsent();

        return self::findOfReceipt($phase, $receipt->receiptId);
    }

    // ----------[ Queries ]----------

    /**
     * The phase's check recorded from this receipt.
     */
    public static function findOfReceipt(Phase $phase, string $receiptId): self
    {
        return self::query()->ofPhase($phase)->ofReceipt($receiptId)->sole();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofPhase(Builder $query, Phase $phase): void
    {
        $query->where('phase_id', $phase->id);
    }

    /**
     * The check recorded from the receipt.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofReceipt(Builder $query, string $receiptId): void
    {
        $query->where('receipt_id', $receiptId);
    }

    /**
     * The rows by recorded at descending.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestRecordedFirst(Builder $query): void
    {
        $query->orderByDesc('recorded_at');
    }
}
