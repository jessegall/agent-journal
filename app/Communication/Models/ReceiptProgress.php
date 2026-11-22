<?php

declare(strict_types=1);

namespace App\Communication\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * How far one chat body has been confirmed in one receiving driver context: the offset up to which every piece was
 * confirmed there, which only grows.
 *
 * @property string $id
 * @property string $receipt_id
 * @property string $context_key
 * @property int $confirmed_offset
 */
#[Table('receipt_progress')]
#[Fillable(['receipt_id', 'context_key', 'confirmed_offset'])]
final class ReceiptProgress extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['confirmed_offset' => 'integer'];
    }

    /**
     * The context's progress on the receipt, starting from nothing confirmed.
     */
    public static function create(string $receiptId, string $contextKey): self
    {
        $progress = new self(['receipt_id' => $receiptId, 'context_key' => $contextKey, 'confirmed_offset' => 0]);
        $progress->save();

        return $progress;
    }

    /**
     * The context's progress on the receipt, once it confirmed a piece of it.
     */
    public static function findFor(string $receiptId, string $contextKey): self|null
    {
        return self::query()->where('receipt_id', $receiptId)->where('context_key', $contextKey)->first();
    }

    /**
     * How far the context confirmed the receipt's body: nothing until it confirmed a first piece.
     */
    public static function confirmedOffsetOf(string $receiptId, string $contextKey): int
    {
        return self::findFor($receiptId, $contextKey)->confirmed_offset ?? 0;
    }

    // ----------[ Mutations ]----------

    /**
     * Moves the confirmed offset forward to the end of a confirmed piece; it never moves back.
     */
    public function advanceTo(int $offset): void
    {
        if ($offset <= $this->confirmed_offset) {
            return;
        }

        $this->confirmed_offset = $offset;
        $this->save();
    }
}
