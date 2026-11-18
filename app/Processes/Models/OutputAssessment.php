<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Links\Support\Linkable;
use App\Processes\Casts\StoredValuesCast;
use App\Processes\Enums\AssessmentOutcome;
use App\Processes\Enums\InterpretationState;
use App\Processes\Exceptions\RevisionImmutable;
use App\Processes\Values\OutputProblem;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One interpretation of a part's output by an approved reader (doc 21 revision 6, section 69): its state, its outcome,
 * every problem with its code, the counts and the offsets the reader consumed. It is never updated; a replay appends a
 * new assessment that names the one it replaces.
 *
 * @property string $id
 * @property string $project_key
 * @property string $part_run_id
 * @property string $reader_revision_id
 * @property string $rule_revision_id
 * @property InterpretationState $interpretation
 * @property AssessmentOutcome $outcome
 * @property list<OutputProblem> $problems
 * @property array<string, int> $counts
 * @property array<string, int> $final_offsets
 * @property string|null $replaces_assessment_id
 * @property Carbon $created_at
 */
#[Fillable([
    'project_key',
    'part_run_id',
    'reader_revision_id',
    'rule_revision_id',
    'interpretation',
    'outcome',
    'problems',
    'counts',
    'final_offsets',
    'replaces_assessment_id',
])]
final class OutputAssessment extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids, Linkable;

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'interpretation' => InterpretationState::class,
            'outcome' => AssessmentOutcome::class,
            'problems' => StoredValuesCast::class.':'.OutputProblem::class,
            'counts' => 'array',
            'final_offsets' => 'array',
        ];
    }

    public function isValid(): bool
    {
        return $this->interpretation === InterpretationState::Valid && $this->problems === [];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $assessment) => throw RevisionImmutable::assessment($assessment->id));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProject(Builder $query, string $projectKey): void
    {
        $query->where('project_key', $projectKey);
    }
}
