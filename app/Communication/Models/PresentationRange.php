<?php

declare(strict_types=1);

namespace App\Communication\Models;

use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One piece of a chat body sent in one batch, from one offset to another, with the digest of the opaque handle the
 * driver confirms it by; the piece's lasting identity is its outstanding range.
 *
 * @property string $id
 * @property string $batch_id
 * @property string $outstanding_range_id
 * @property string $receipt_id
 * @property int $start_offset
 * @property int $end_offset
 * @property string $handle_digest
 * @property CarbonImmutable|null $confirmed_at
 */
#[Table('presentation_ranges')]
#[Fillable(['batch_id', 'outstanding_range_id', 'receipt_id', 'start_offset', 'end_offset', 'handle_digest'])]
final class PresentationRange extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_offset' => 'integer',
            'end_offset' => 'integer',
            'confirmed_at' => 'immutable_datetime',
        ];
    }

    /**
     * The piece added to the batch under the digest of its handle.
     */
    public static function inBatch(
        PresentationBatch $batch,
        OutstandingRange $outstanding,
        int $endOffset,
        string $handleDigest,
    ): self {
        $range = new self([
            'batch_id' => $batch->id,
            'outstanding_range_id' => $outstanding->id,
            'receipt_id' => $outstanding->receipt_id,
            'start_offset' => $outstanding->start_offset,
            'end_offset' => $endOffset,
            'handle_digest' => $handleDigest,
        ]);

        $range->save();

        return $range;
    }

    // ----------[ Mutations ]----------

    /**
     * Marks the piece confirmed once; a second confirmation answers that it changed nothing.
     */
    public function confirm(CarbonImmutable $at): bool
    {
        if ($this->confirmed_at !== null) {
            return false;
        }

        $this->confirmed_at = $at;
        $this->save();

        return true;
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<OutstandingRange, $this>
     */
    public function outstanding(): BelongsTo
    {
        return $this->belongsTo(OutstandingRange::class, 'outstanding_range_id');
    }
}
