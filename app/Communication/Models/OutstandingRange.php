<?php

declare(strict_types=1);

namespace App\Communication\Models;

use App\Communication\Enums\OutstandingRangeState;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One still-unconfirmed piece of a chat body for its receiving agent, the same row across every retry that presents
 * it again, so only this piece counts its failures.
 *
 * @property string $id
 * @property string $receipt_id
 * @property int $start_offset
 * @property int $consecutive_failures
 * @property OutstandingRangeState $state
 * @property string|null $exhausted_reason
 */
#[Table('outstanding_ranges')]
#[Fillable(['receipt_id', 'start_offset', 'consecutive_failures', 'state'])]
final class OutstandingRange extends Model implements ReadableModel
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
            'start_offset' => 'integer',
            'consecutive_failures' => 'integer',
            'state' => OutstandingRangeState::class,
        ];
    }

    /**
     * The piece of the receipt's body starting at the offset, made the first time it is presented and found again
     * on every retry.
     */
    public static function at(MessageReceipt $receipt, int $startOffset): self
    {
        return self::query()->firstOrCreate(
            [
                'receipt_id' => $receipt->id,
                'start_offset' => $startOffset,
                'state' => OutstandingRangeState::Outstanding,
            ],
            ['consecutive_failures' => 0],
        );
    }

    // ----------[ Mutations ]----------

    public function confirm(): void
    {
        $this->state = OutstandingRangeState::Confirmed;
        $this->consecutive_failures = 0;
        $this->save();
    }

    public function recordFailure(): void
    {
        $this->consecutive_failures++;
        $this->save();
    }

    public function exhaust(string $reason): void
    {
        $this->state = OutstandingRangeState::Exhausted;
        $this->exhausted_reason = $reason;
        $this->save();
    }
}
