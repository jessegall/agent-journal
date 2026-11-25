<?php

declare(strict_types=1);

namespace App\Models\Runs;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\Runs\AssessmentOutcome;
use App\Enums\Runs\InterpretationState;
use App\Enums\Runs\ProblemCode;
use App\Exceptions\RevisionImmutable;
use App\Models\CommandRules\RuleRevision;
use App\Values\OutputProblem;
use App\Values\OutputValidation;
use App\Values\ReplayedOutput;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Spatie\LaravelData\DataCollection;

/**
 * @property string $id
 * @property string $project_key
 * @property string $part_run_id
 * @property string $reader_revision_id
 * @property string $rule_revision_id
 * @property InterpretationState $interpretation
 * @property AssessmentOutcome $outcome
 * @property DataCollection<int, OutputProblem> $problems
 * @property array<string,int> $counts
 * @property array<string,int> $final_offsets
 * @property string|null $replaces_assessment_id
 * @property CarbonImmutable $created_at
 *
 * @mixin \Eloquent
 */
final class OutputAssessment extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const null UPDATED_AT = null;

    /**
     * @return array<string, string>
     *
     * @column counts array<string,int>
     * @column final_offsets array<string,int>
     */
    protected function casts(): array
    {
        return [
            'interpretation' => InterpretationState::class,
            'outcome' => AssessmentOutcome::class,
            'problems' => DataCollection::class.':'.OutputProblem::class,
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
        $previous = self::query()->ofPart($part)->first();

        $outputAssessment = new self();
        $outputAssessment->project_key = $run->project_key;
        $outputAssessment->part_run_id = $part->id;
        $outputAssessment->reader_revision_id = $reader->id;
        $outputAssessment->rule_revision_id = $declaration->id;
        $outputAssessment->interpretation = self::interpretationOf($validation->problems);
        $outputAssessment->outcome = $validation->outcome;
        $outputAssessment->problems = OutputProblem::collect($validation->problems, DataCollection::class);
        $outputAssessment->counts = $replayed->assessment->counts;
        $outputAssessment->final_offsets = $replayed->consumed->offsets;
        $outputAssessment->replaces_assessment_id = $previous?->id;
        $outputAssessment->save();

        return $outputAssessment;
    }

    // ----------[ Predicates ]----------

    public function isValid(): bool
    {
        return $this->interpretation === InterpretationState::Valid && $this->problems->items() === [];
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

        if (array_any($problems, fn (OutputProblem $problem) => $problem->code === ProblemCode::ReaderFailed)) {
            return InterpretationState::ReaderFailed;
        }

        return InterpretationState::Invalid;
    }

    // ----------[ Queries ]----------

    /**
     * The newest assessment of that part's output; none before its first.
     */
    public static function findLatestOf(PartRun $part): self|null
    {
        return self::query()->ofPart($part)->first();
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
