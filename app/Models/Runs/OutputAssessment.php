<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Casts\StoredValuesCast;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\AssessmentOutcome;
use App\Enums\InterpretationState;
use App\Enums\ProblemCode;
use App\Exceptions\RevisionImmutable;
use App\Models\CommandRules\RuleRevision;
use App\Values\OutputProblem;
use App\Values\OutputValidation;
use App\Values\ReplayedOutput;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One interpretation of a part's output by an approved reader: its state, its outcome,
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
    use HasUlids;
    use Linkable;

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

    protected static function booted(): void
    {
        self::updating(fn (self $assessment) => $assessment->assertUnedited());
    }

    // ----------[ Constructors ]----------

    /**
     * The next assessment of a part: what the approved reader made of it and what the validator found, linked to the
     * assessment it replaces.
     */
    public static function create(
        ProcessRun $run,
        PartRun $part,
        RuleRevision $declaration,
        ReaderRevision $reader,
        ReplayedOutput $replayed,
        OutputValidation $validation,
    ): self {
        $previous = self::query()->ofPart($part)->newestFirst()->first();

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

    // ----------[ Getters ]----------

    public function isValid(): bool
    {
        return $this->interpretation === InterpretationState::Valid && $this->problems === [];
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses every edit: it stays as it was written.
     *
     * @throws RevisionImmutable
     */
    private function assertUnedited(): never
    {
        throw RevisionImmutable::assessment($this->id);
    }

    // ----------[ Internals ]----------

    /**
     * @param  list<OutputProblem>  $problems
     */
    private static function interpretationOf(array $problems): InterpretationState
    {
        if ($problems === []) {
            return InterpretationState::Valid;
        }

        if (array_any($problems, fn (OutputProblem $problem): bool => $problem->code === ProblemCode::ReaderFailed)) {
            return InterpretationState::ReaderFailed;
        }

        return InterpretationState::Invalid;
    }

    // ----------[ Queries ]----------

    /**
     * The newest assessment of that part's output; none before its first.
     */
    public static function latestOf(PartRun $part): self|null
    {
        return self::query()->ofPart($part)->newestFirst()->first();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofProject(Builder $query, string $projectKey): void
    {
        $query->where('project_key', $projectKey);
    }

    /**
     * The part's assessments.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofPart(Builder $query, PartRun $part): void
    {
        $query->where('part_run_id', $part->id);
    }
}
