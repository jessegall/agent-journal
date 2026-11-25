<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Models;

use App\Concerns\Linkable;
use App\Contracts\Records\Numbered;
use App\Concerns\HasNumber;
use App\Contracts\Records\ReadableModel;
use App\Concerns\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * One entry of a ledger, numbered within its ledger like a phase within its plan.
 *
 * @property string $id
 * @property string $ledger_id
 * @property string $text
 */
#[Fillable(['ledger_id', 'text'])]
final class LedgerEntry extends Model implements Numbered, ReadableModel
{
    use BoundedReads;
    use HasNumber;
    use HasUlids;
    use Linkable;

    /**
     * @return BelongsTo<Ledger, $this>
     */
    public function ledger(): BelongsTo
    {
        return $this->belongsTo(Ledger::class);
    }

    public function numberHolder(): Model
    {
        return $this->relationLoaded('ledger') ? $this->ledger : $this->ledger()->sole();
    }

    public static function write(string $ledgerId, string $text): self
    {
        return self::query()->create(['ledger_id' => $ledgerId, 'text' => $text]);
    }

}
