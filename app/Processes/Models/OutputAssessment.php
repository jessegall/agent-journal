<?php

declare(strict_types=1);

namespace App\Processes\Models;

use App\Links\Support\Linkable;
use App\Processes\Casts\StoredValuesCast;
use App\Processes\Enums\AssessmentOutcome;
use App\Processes\Enums\InterpretationState;
use App\Processes\Enums\ProblemCode;
use App\Processes\Exceptions\RevisionImmutable;
use App\Processes\Values\OutputProblem;
use App\Processes\Values\OutputValidation;
use App\Processes\Values\ReplayedOutput;
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

    /**
     * The next assessment of a part: what the approved reader made of it and what the validator found, linked to the
     * assessment it replaces.
     */
    public static function record(
        ProcessRun $run,
        PartRun $part,
        RuleRevision $declaration,
        ReaderRevision $reader,
        ReplayedOutput $replayed,
        OutputValidation $validation,
    ): self {
        $previous = self::query()->where('part_run_id', $part->id)->latest('created_at')->first();

        return self::query()->create([
            'project_key' => $run->project_key,
            'part_run_id' => $part->id,
            'reader_revision_id' => $reader->id,
            'rule_revision_id' => $declaration->id,
            'interpretation' => self::interpretationOf($validation->problems),
            'outcome' => $validation->outcome,
            'problems' => $validation->problems,
            'counts' => $replayed->assessment->counts,
            'final_offsets' => $replayed->consumed->offsets,
            'replaces_assessment_id' => $previous?->id,
        ]);
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

    /**
     * @param  list<OutputProblem>  $problems
     */
    private static function interpretationOf(array $problems): InterpretationState
    {
        if ($problems === []) {
            return InterpretationState::Valid;
        }

        return array_any($problems, fn (OutputProblem $problem): bool => $problem->code === ProblemCode::ReaderFailed)
            ? InterpretationState::ReaderFailed
            : InterpretationState::Invalid;
    }
}
