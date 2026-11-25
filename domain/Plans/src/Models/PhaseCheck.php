<?php

declare(strict_types=1);

namespace Domain\Plans\Models;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Support\ActorIdentity;
use App\Values\PublishedResult;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A check result a phase relies on (story 197): the operation, the validated result receipt it was read from, its
 * outcome, and who recorded it.
 *
 * @property string $id
 * @property string $phase_id
 * @property string $operation
 * @property string $receipt_id
 * @property string $outcome
 * @property string $actor_type
 * @property string $actor_id
 * @property Carbon $recorded_at
 */
#[Fillable(['phase_id', 'operation', 'receipt_id', 'outcome', 'actor_type', 'actor_id'])]
final class PhaseCheck extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
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

    // ----------[ Queries ]----------

    /**
     * The phase relies on this receipt's result; recording the same receipt again changes nothing.
     */
    public static function record(Phase $phase, PublishedResult $receipt, ActorIdentity $recorder): self
    {
        $check = new self([
            'phase_id' => $phase->id,
            'receipt_id' => $receipt->receiptId,
            'operation' => $receipt->operation,
            'outcome' => $receipt->outcome->value,
            'actor_type' => $recorder->type->value,
            'actor_id' => $recorder->id,
        ]);

        $check->setAttribute($check->getKeyName(), $check->newUniqueId());
        $check->insertIfAbsent();

        return self::query()->ofPhase($phase)->ofReceipt($receipt->receiptId)->sole();
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
}
