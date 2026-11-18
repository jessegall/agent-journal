<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Ledger\Models;

use App\Links\Support\Linkable;
use App\Numbers\Contracts\Numbered;
use App\Numbers\Support\HasNumber;
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
final class LedgerEntry extends Model implements Numbered
{
    use HasNumber, HasUlids, Linkable;

    public const string LINK_TYPE = 'ledger.entry';

    /**
     * @return BelongsTo<Ledger, $this>
     */
    public function ledger(): BelongsTo
    {
        return $this->belongsTo(Ledger::class);
    }

    public function numberHolder(): Model
    {
        return $this->ledger;
    }
}
