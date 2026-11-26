<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\Runs\RunLogicalResult;
use App\Models\Support\JournalModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Table;

/**
 * @property string $id
 * @property string $run_id
 * @property string $attempt_id
 * @property RunLogicalResult $kept_result
 * @property RunLogicalResult $offered_result
 * @property CarbonImmutable|null $created_at
 *
 * @mixin \Eloquent
 */
#[Table('run_result_conflicts')]
final class RunResultConflict extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use Linkable;

    public const ?string UPDATED_AT = null;

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'kept_result' => RunLogicalResult::class,
            'offered_result' => RunLogicalResult::class,
        ];
    }

    // ----------[ Constructors ]----------

    public static function create(RunOutcome $kept, RunLogicalResult $offered): self
    {
        $conflict = new self();
        $conflict->run_id = $kept->run_id;
        $conflict->attempt_id = $kept->attempt_id;
        $conflict->kept_result = $kept->result;
        $conflict->offered_result = $offered;

        $conflict->save();

        return $conflict;
    }
}
