<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Processes\Enums\RunLogicalResult;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * A second authoritative result for a run attempt that disagreed with the first, refused and kept for investigation.
 *
 * @property string $id
 * @property string $run_id
 * @property string $attempt_id
 * @property RunLogicalResult $kept_result
 * @property RunLogicalResult $offered_result
 * @property CarbonImmutable|null $created_at
 */
#[Table('run_result_conflicts')]
#[Fillable(['run_id', 'attempt_id', 'kept_result', 'offered_result'])]
final class RunResultConflict extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;

    public const ?string UPDATED_AT = null;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'kept_result' => RunLogicalResult::class,
            'offered_result' => RunLogicalResult::class,
            'created_at' => 'immutable_datetime',
        ];
    }

    public static function create(RunOutcome $kept, RunLogicalResult $offered): self
    {
        $conflict = new self([
            'run_id' => $kept->run_id,
            'attempt_id' => $kept->attempt_id,
            'kept_result' => $kept->result,
            'offered_result' => $offered,
        ]);

        $conflict->save();

        return $conflict;
    }
}
